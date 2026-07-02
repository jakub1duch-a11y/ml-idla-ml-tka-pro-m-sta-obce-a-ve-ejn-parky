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

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions[0];

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

    return Response.json({ ok: true, project: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});