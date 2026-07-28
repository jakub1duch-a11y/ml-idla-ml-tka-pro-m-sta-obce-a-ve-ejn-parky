import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const projectId = body.project_id;
    const sessionToken = body.session_token;

    if (!projectId || !sessionToken) {
      return Response.json({ error: 'Missing project_id or session_token' }, { status: 400 });
    }

    if (typeof projectId !== 'string' || typeof sessionToken !== 'string') {
      return Response.json({ error: 'Invalid input types' }, { status: 400 });
    }

    // Session tokens are always issued as crypto.randomUUID() — reject anything
    // that doesn't match that format before querying, so a malformed/non-string
    // shaped value can never be used to probe the session store.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionToken)) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    // Defense-in-depth: require an exact token match rather than trusting the filter alone.
    const session = sessions.find((s) => s.token === sessionToken);

    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project) return Response.json({ error: 'not_found' }, { status: 404 });

    if ((project.client_email || '').toLowerCase() !== session.email.toLowerCase()) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    if (project.status !== 'sent') {
      return Response.json({ error: 'invalid_status' }, { status: 400 });
    }

    const approvedAt = new Date().toISOString();
    const updated = await base44.asServiceRole.entities.ProjectOrder.update(projectId, {
      status: 'approved',
      approved_at: approvedAt,
    });

    // Single-use: invalidate the session token immediately after a successful approval.
    await base44.asServiceRole.entities.PortalSession.delete(session.id);

    return Response.json({ ok: true, project: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});