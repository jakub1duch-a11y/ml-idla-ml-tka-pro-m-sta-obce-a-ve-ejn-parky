import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const recipients = ['meduna@holmtec.cz', 'jakub1duch@gmail.com', 'duch@holmtec.cz'];

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function encodeMessage({ to, subject, body }) {
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const message = [`To: ${to}`, 'From: Mlžidla.cz <me>', `Subject: ${encodedSubject}`, 'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', body].join('\r\n');
  return btoa(unescape(encodeURIComponent(message))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const payload = await req.json();
    const inquiryId = payload?.inquiry_id;
    if (!inquiryId) return Response.json({ error: 'Missing inquiry id' }, { status: 400 });
    const inquiry = await base44.asServiceRole.entities.ContactInquiry.get(inquiryId);
    if (!inquiry) return Response.json({ error: 'Inquiry not found' }, { status: 404 });
    const subject = `Nová poptávka z webu — ${inquiry.name || 'Neznámý'}`;
    const body = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:28px;background:#082430;color:#fff"><h1 style="margin:0 0 18px;color:#58c7d6">Nová poptávka MLŽIDLA</h1><p><strong>Jméno:</strong> ${escapeHtml(inquiry.name)}</p><p><strong>E-mail:</strong> ${escapeHtml(inquiry.email)}</p><p><strong>Projekt:</strong> ${escapeHtml(inquiry.project_scope || '—')}</p><p><strong>Zpráva:</strong><br>${escapeHtml(inquiry.message).replace(/\n/g, '<br>')}</p></div>`;
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const results = await Promise.all(recipients.map(async (to) => {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: encodeMessage({ to, subject, body }) }) });
      return { to, ok: response.ok };
    }));
    if (results.some((result) => !result.ok)) return Response.json({ error: 'Notification delivery failed', results }, { status: 500 });
    return Response.json({ ok: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}