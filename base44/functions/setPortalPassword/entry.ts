import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Keep PBKDF2 strong while staying within the CPU budget of the Base44 edge runtime.
// The iteration count is stored with each account, so it can be raised transparently later.
const ITERATIONS = 120000;
const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();

const bytesToBase64Url = (bytes: Uint8Array) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

async function derivePasswordHash(password: string, salt: Uint8Array, iterations = ITERATIONS) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    256,
  );
  return new Uint8Array(bits);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sessionToken = String(body.session_token || '').trim();
    const password = String(body.password || '');

    if (!sessionToken) return Response.json({ error: 'missing_session' }, { status: 401 });
    if (password.length < 10 || password.length > 128 || !/[A-Za-zÀ-ž]/.test(password) || !/\d/.test(password)) {
      return Response.json({ error: 'password_policy', message: 'Heslo musí mít alespoň 10 znaků, písmeno a číslici.' }, { status: 400 });
    }

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions?.[0];
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      if (session) await base44.asServiceRole.entities.PortalSession.delete(session.id).catch(() => null);
      return Response.json({ error: 'session_expired' }, { status: 401 });
    }

    const email = normalizeEmail(session.email);
    if (!email) return Response.json({ error: 'session_invalid' }, { status: 401 });

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivePasswordHash(password, salt, ITERATIONS);
    const now = new Date().toISOString();
    const accountData = {
      email,
      password_hash: bytesToBase64Url(hash),
      password_salt: bytesToBase64Url(salt),
      password_iterations: ITERATIONS,
      password_set_at: now,
      failed_attempts: 0,
      last_login_at: now,
    };

    const existing = await base44.asServiceRole.entities.PortalAccount.filter({ email });
    if (existing?.[0]) {
      await base44.asServiceRole.entities.PortalAccount.update(existing[0].id, {
        ...accountData,
        locked_until: now,
      });
    } else {
      await base44.asServiceRole.entities.PortalAccount.create(accountData);
    }

    // Po úspěšném nastavení hesla ponecháme stejný token, ale prodloužíme
    // ověřenou relaci na běžných 8 hodin. Klient tak není krátce po vstupu
    // odhlášen při odeslání zprávy nebo potvrzení nabídky.
    await base44.asServiceRole.entities.PortalSession.update(session.id, {
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    });

    return Response.json({ ok: true, email, password_set: true, session_token: sessionToken });
  } catch (error) {
    console.error('setPortalPassword failed', error);
    return Response.json({ error: 'password_setup_failed' }, { status: 500 });
  }
});
