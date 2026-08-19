import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const TEAM = ['meduna@holmtec.cz', 'info@mlzidla.cz', 'jakub1duch@gmail.com'];
const normalize = (value: unknown) => String(value || '').trim();
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char] as string));
const money = (value: unknown) => new Intl.NumberFormat('cs-CZ').format(Math.round(Number(value || 0)));

async function sendEmail(base44: any, to: string, subject: string, html: string) {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const mime = [`To: ${to}`, 'From: MLŽIDLA.cz <me>', 'Reply-To: meduna@holmtec.cz', `Subject: ${encodedSubject}`, 'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html].join('\r\n');
    const raw = btoa(unescape(encodeURIComponent(mime))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
  } catch (error) {
    console.error('Extra charge notification failed', error);
  }
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const chargeId = normalize(body.charge_id);
    const sessionToken = normalize(body.session_token);
    const action = normalize(body.action);
    const note = normalize(body.note).slice(0, 1000);

    if (!chargeId || !sessionToken || !['approve','decline'].includes(action)) {
      return Response.json({ error: 'invalid_request' }, { status: 400 });
    }

    const sessions = await base44.asServiceRole.entities.PortalSession.filter({ token: sessionToken });
    const session = sessions?.find((item: any) => item.token === sessionToken);
    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'invalid_or_expired_session' }, { status: 401 });
    }

    const charge = await base44.asServiceRole.entities.ProjectExtraCharge.get(chargeId).catch(() => null);
    if (!charge) return Response.json({ error: 'not_found' }, { status: 404 });
    if (charge.status !== 'pending_customer_approval') return Response.json({ error: 'invalid_status' }, { status: 400 });

    const project = await base44.asServiceRole.entities.ProjectOrder.get(charge.project_order_id).catch(() => null);
    if (!project) return Response.json({ error: 'project_not_found' }, { status: 404 });
    if (String(project.client_email || '').toLowerCase() !== String(session.email || '').toLowerCase()) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const updated = await base44.asServiceRole.entities.ProjectExtraCharge.update(chargeId, action === 'approve' ? {
      status: 'approved',
      customer_approved_at: now,
      customer_note: note,
    } : {
      status: 'declined',
      customer_declined_at: now,
      customer_note: note,
    });

    const subject = `${action === 'approve' ? 'Schválený' : 'Odmítnutý'} příplatek k nabídce ${project.quote_number || ''} | MLŽIDLA®`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:28px;background:#0d2d38;color:#fff"><div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#61d5e5">MLŽIDLA® · reakce klienta</div><h1 style="margin:8px 0 18px;font-size:24px">${action === 'approve' ? 'Příplatková položka schválena' : 'Příplatková položka odmítnuta'}</h1><p style="color:#cfe4e8"><strong>Projekt:</strong> ${escapeHtml(project.project_name || project.product_name || '')}<br><strong>Nabídka:</strong> ${escapeHtml(project.quote_number || '')}<br><strong>Položka:</strong> ${escapeHtml(charge.title)}<br><strong>Částka:</strong> ${money(charge.total_price_ex_vat)} Kč bez DPH<br><strong>Klient:</strong> ${escapeHtml(project.client_name)} · ${escapeHtml(project.client_email)}</p>${note ? `<div style="margin-top:18px;padding:16px;border:1px solid #245966;border-radius:12px;color:#d7e8eb"><strong>Poznámka klienta:</strong><br>${escapeHtml(note).replace(/\n/g,'<br>')}</div>` : ''}</div>`;
    await Promise.all(TEAM.map((to) => sendEmail(base44, to, subject, html)));

    const charges = await base44.asServiceRole.entities.ProjectExtraCharge.filter({ project_order_id: project.id }, 'created_date', 100);
    return Response.json({ ok: true, charge: updated, charges });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
