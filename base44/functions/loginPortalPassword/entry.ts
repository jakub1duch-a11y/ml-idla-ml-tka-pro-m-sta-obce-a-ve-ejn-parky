import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();

const base64UrlToBytes = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

async function derivePasswordHash(password: string, salt: Uint8Array, iterations: number) {
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

function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function loadPortalData(base44: any, email: string) {
  const contactInquiries = await base44.asServiceRole.entities.ContactInquiry.filter({ email });
  const poptavky = await base44.asServiceRole.entities.Poptavka.filter({ email }).catch(() => []);
  const rawProjects = await base44.asServiceRole.entities.ProjectOrder.filter({ client_email: email });

  const projects = await Promise.all((rawProjects || []).map(async (project: any) => {
    const assets = await base44.asServiceRole.entities.OfferAsset.filter({ project_order_id: project.id }).catch(() => []);
    const selectedAssets = (assets || [])
      .filter((asset: any) => asset.selected_for_offer || ['generated_visualization', 'quote_pdf', 'presentation_pdf', 'presentation'].includes(asset.asset_type))
      .sort((a: any, b: any) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
    const visualizations = selectedAssets.filter((asset: any) => asset.asset_type === 'generated_visualization');
    const documents = selectedAssets.filter((asset: any) => asset.asset_type !== 'generated_visualization');
    const offerMessages = await base44.asServiceRole.entities.OfferMessage.filter({ project_order_id: project.id }, 'created_date', 100).catch(() => []);
    const extraCharges = await base44.asServiceRole.entities.ProjectExtraCharge.filter({ project_order_id: project.id }, 'created_date', 100).catch(() => []);
    return {
      ...project,
      offer_assets: selectedAssets,
      visualizations,
      documents,
      offer_messages: offerMessages || [],
      extra_charges: (extraCharges || []).filter((charge: any) => charge.status !== 'draft' && charge.status !== 'cancelled'),
      primary_visualization_url: visualizations[0]?.file_url || '',
    };
  }));

  return {
    inquiries: [...(contactInquiries || []), ...(poptavky || [])],
    projects,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    if (!email || !password) return Response.json({ error: 'invalid_credentials' }, { status: 401 });

    const accounts = await base44.asServiceRole.entities.PortalAccount.filter({ email });
    const account = accounts?.[0];
    if (!account?.password_hash || !account?.password_salt) {
      return Response.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    const now = Date.now();
    if (account.locked_until && new Date(account.locked_until).getTime() > now) {
      return Response.json({ error: 'temporarily_locked' }, { status: 429 });
    }

    const iterations = Math.max(100000, Number(account.password_iterations || 210000));
    const calculated = await derivePasswordHash(password, base64UrlToBytes(account.password_salt), iterations);
    const expected = base64UrlToBytes(account.password_hash);
    const valid = equalBytes(calculated, expected);

    if (!valid) {
      const failedAttempts = Number(account.failed_attempts || 0) + 1;
      const update: Record<string, unknown> = { failed_attempts: failedAttempts };
      if (failedAttempts >= 5) {
        update.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        update.failed_attempts = 0;
      }
      await base44.asServiceRole.entities.PortalAccount.update(account.id, update);
      return Response.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    const data = await loadPortalData(base44, email);
    if (!data.inquiries.length && !data.projects.length) {
      return Response.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    const existingSessions = await base44.asServiceRole.entities.PortalSession.filter({ email });
    for (const session of existingSessions) await base44.asServiceRole.entities.PortalSession.delete(session.id);

    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    await base44.asServiceRole.entities.PortalSession.create({ email, token: sessionToken, expires_at: sessionExpiresAt });
    await base44.asServiceRole.entities.PortalAccount.update(account.id, {
      failed_attempts: 0,
      locked_until: new Date(0).toISOString(),
      last_login_at: new Date().toISOString(),
    });

    return Response.json({
      verified: true,
      email,
      inquiries: data.inquiries,
      projects: data.projects,
      session_token: sessionToken,
      password_setup_required: false,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'login_failed' }, { status: 500 });
  }
});
