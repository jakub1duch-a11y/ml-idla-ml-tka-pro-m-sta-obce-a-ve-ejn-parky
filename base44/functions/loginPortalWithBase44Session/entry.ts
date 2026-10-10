import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { registeredPortal } from '../../shared/registeredPortal.ts';
import { loadClientPortalData, normalizePortalEmail } from '../../shared/clientPortal.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const email = normalizePortalEmail(user?.email);

    if (!email) {
      return Response.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    if (body.mode === 'workspace') return await registeredPortal(base44, email, body);
    const { inquiries, projects } = body.mode === 'session_only' ? { inquiries: [], projects: [] } : await loadClientPortalData(base44, email);
    // Keep other active devices and tabs signed in.
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    await base44.asServiceRole.entities.PortalSession.create({
      email,
      token: sessionToken,
      expires_at: sessionExpiresAt,
    });

    return Response.json({
      verified: true,
      email,
      inquiries,
      projects,
      session_token: sessionToken,
      auth_method: 'base44_session',
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'portal_session_login_failed' }, { status: 500 });
  }
}