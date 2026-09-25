import { createClientFromRequest } from 'npm:@base44/sdk';

const ITERATIONS = 210000;
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
  let stage = 'request';
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const sessionToken = String(body.session_token || '').trim();
    const password = String(body.password || '');

    if (!sessionToken) return Response.json({ error: 'missing_session' }, { status: 401 });
    if (password.length < 10 || password.length > 128 || !/[A-Za-zÀ-ž]/.test(password) || !/\d/.test(password)) {
      return Response.json({ error: 'password_policy' }, { status: 400 });
    }

    stage = 'session_lookup';
    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions?.[0];
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      if (session) await base44.asServiceRole.entities.PortalSession.delete(session.id).catch(() => null);
      return Response.json({ error: 'session_expired' }, { status: 401 });
    }

    const email = normalizeEmail(session.email);
    if (!email) return Response.json({ error: 'session_invalid' }, { status: 401 });

    stage = 'hash';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivePasswordHash(password, salt);
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

    stage = 'account_write';
    const existing = await base44.asServiceRole.entities.PortalAccount.filter({ email });
    if (existing?.[0]?.id) {
      await base44.asServiceRole.entities.PortalAccount.update(existing[0].id, {
        ...accountData,
        locked_until: now,
      });
    } else {
      await base44.asServiceRole.entities.PortalAccount.create(accountData);
    }

    // Verify persistence from a fresh query instead of relying on the shape of
    // create()/update() responses, which can differ between SDK deployments.
    stage = 'account_verify';
    const persisted = await base44.asServiceRole.entities.PortalAccount.filter({ email }, '-updated_date', 1);
    const account = persisted?.[0];
    if (!account?.id || account.password_hash !== accountData.password_hash || !account.password_set_at) {
      console.error('setPortalPassword account verification failed', { email, hasAccount: Boolean(account?.id) });
      return Response.json({ error: 'account_write_failed' }, { status: 503 });
    }

    // The password is already safely stored at this point. Session extension is
    // deliberately best-effort so a transient session write cannot turn a
    // successful password change into a false failure in the UI.
    stage = 'session_renew';
    const renewedExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    let expiresAt = session.expires_at;
    try {
      await base44.asServiceRole.entities.PortalSession.update(session.id, { expires_at: renewedExpiry });
      expiresAt = renewedExpiry;
    } catch (sessionError) {
      console.warn('setPortalPassword session renewal skipped', {
        email,
        message: sessionError instanceof Error ? sessionError.message : String(sessionError),
      });
    }

    return Response.json(
      { ok: true, email, password_set: true, session_token: sessionToken, expires_at: expiresAt },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
        },
      },
    );
  } catch (error) {
    console.error('setPortalPassword failed', {
      stage,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return Response.json({ error: stage === 'account_write' || stage === 'account_verify' ? 'account_write_failed' : 'password_setup_failed' }, { status: 500 });
  }
});
