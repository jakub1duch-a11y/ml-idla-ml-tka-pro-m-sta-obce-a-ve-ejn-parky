import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const projectId = String(body.project_id || '');
    const sessionToken = String(body.session_token || '');
    const action = String(body.action || '');
    const estimatedOrderDate = body.estimated_order_date ? String(body.estimated_order_date) : '';
    const estimatedOrderWindow = String(body.estimated_order_window || '').slice(0, 120);
    const message = String(body.message || '').slice(0, 1000);

    if (!projectId || !sessionToken || !['extension','timing'].includes(action)) {
      return Response.json({ error: 'invalid_request' }, { status: 400 });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionToken)) return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions.find((s) => s.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project) return Response.json({ error: 'not_found' }, { status: 404 });
    if ((project.client_email || '').toLowerCase() !== session.email.toLowerCase()) return Response.json({ error: 'forbidden' }, { status: 403 });
    if (['approved','in_production','ready','delivered','rejected'].includes(project.status)) return Response.json({ error: 'invalid_status' }, { status: 400 });

    const now = new Date().toISOString();
    const update = {
      last_customer_action_at: now,
      customer_message: message,
      estimated_order_date: estimatedOrderDate || undefined,
      estimated_order_window: estimatedOrderWindow || undefined,
    };

    if (action === 'extension') {
      update.status = 'extension_requested';
      update.validity_extension_requested_at = now;
      update.validity_extension_note = message || 'Zákazník požádal o prodloužení platnosti nabídky.';
    }

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);
    const updated = await base44.asServiceRole.entities.ProjectOrder.update(projectId, update);
    return Response.json({ ok: true, project: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
