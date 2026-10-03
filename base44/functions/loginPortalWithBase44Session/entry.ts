import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { loadClientPortalData, normalizePortalEmail } from '../../shared/clientPortal.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const email = normalizePortalEmail(user?.email);

    if (!email) {
      return Response.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { inquiries, projects } = await loadClientPortalData(base44, email);
    if (!inquiries.length && !projects.length) {
      return Response.json({ error: 'no_client_access' }, {
        status: 403,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    const existingSessions = await base44.asServiceRole.entities.PortalSession.filter({ email }).catch(() => []);
    for (const session of existingSessions || []) {
      await base44.asServiceRole.entities.PortalSession.delete(session.id);
    }

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
});
