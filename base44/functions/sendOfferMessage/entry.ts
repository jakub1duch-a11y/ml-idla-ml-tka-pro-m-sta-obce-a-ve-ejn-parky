import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const TEAM_RECIPIENTS = ['meduna@holmtec.cz', 'info@mlzidla.cz', 'jakub1duch@gmail.com'];
const CATEGORY_LABELS = {
  question: 'Dotaz k nabídce',
  solution_change: 'Požadavek na úpravu řešení',
  technical: 'Technický dotaz',
  delivery: 'Dotaz k termínu / dodání',
  other: 'Zpráva k projektu',
};

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char] as string));

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const projectId = String(body.project_id || '');
    const sessionToken = String(body.session_token || '');
    const message = String(body.message || '').trim().slice(0, 3000);
    const category = String(body.category || 'question');

    if (!projectId || !sessionToken || !message || !Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, category)) {
      return Response.json({ error: 'invalid_request' }, { status: 400 });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionToken)) return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions.find((item) => item.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }

    const project = await base44.asServiceRole.entities.ProjectOrder.get(projectId).catch(() => null);
    if (!project) return Response.json({ error: 'not_found' }, { status: 404 });
    if (String(project.client_email || '').trim().toLowerCase() !== String(session.email || '').trim().toLowerCase()) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    const created = await base44.asServiceRole.entities.OfferMessage.create({
      project_order_id: project.id,
      quote_number: project.quote_number || '',
      sender_type: 'customer',
      sender_name: project.client_name || '',
      sender_email: project.client_email || session.email,
      message,
      category,
      channel: 'portal',
      read_by_team: false,
      read_by_customer: true,
    });

    await base44.asServiceRole.entities.ProjectOrder.update(project.id, {
      customer_message: message.slice(0, 1000),
      last_customer_action_at: new Date().toISOString(),
    });

    const subject = `${CATEGORY_LABELS[category]} ${project.quote_number ? `· ${project.quote_number}` : ''} | MLŽIDLA®`.replace('  ', ' ');
    const bodyHtml = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#eef3f4;padding:24px">
        <div style="background:#0d2d38;color:white;padding:24px;border-radius:18px 18px 0 0">
          <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#61d5e5">MLŽIDLA® · zpráva zákazníka</div>
          <h1 style="font-size:22px;margin:8px 0 0">${escapeHtml(CATEGORY_LABELS[category])}</h1>
        </div>
        <div style="background:white;padding:28px;border:1px solid #dbe5e7;border-top:0;border-radius:0 0 18px 18px">
          <p style="margin:0 0 8px;color:#6c8086;font-size:12px">Nabídka / projekt</p>
          <p style="margin:0 0 18px;color:#0d2d38;font-size:16px;font-weight:700">${escapeHtml(project.quote_number || project.project_name || project.product_name || project.id)}</p>
          <p style="margin:0 0 8px;color:#6c8086;font-size:12px">Zákazník</p>
          <p style="margin:0 0 18px;color:#0d2d38;font-size:14px">${escapeHtml(project.client_name)} · ${escapeHtml(project.client_email)}${project.client_phone ? ` · ${escapeHtml(project.client_phone)}` : ''}</p>
          <div style="padding:18px;border-radius:14px;background:#f5f8f8;color:#334b53;font-size:14px;line-height:1.7">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
        </div>
      </div>`;

    await Promise.all(TEAM_RECIPIENTS.map((to) => base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body: bodyHtml }).catch(() => null)));

    const messages = await base44.asServiceRole.entities.OfferMessage.filter({ project_order_id: project.id }, 'created_date', 100).catch(() => []);
    return Response.json({ ok: true, message: created, messages });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
