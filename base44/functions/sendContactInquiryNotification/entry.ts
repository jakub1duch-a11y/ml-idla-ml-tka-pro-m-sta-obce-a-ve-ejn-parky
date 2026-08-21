import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const recipients = ['meduna@holmtec.cz', 'jakub1duch@gmail.com', 'duch@holmtec.cz'];
const CONTACT_EMAIL = 'meduna@holmtec.cz';
const INFO_EMAIL = 'info@mlzidla.cz';
const PHONE = '+420 774 700 390';
const SITE_URL = 'https://mlzidla.cz';
const INSTAGRAM_URL = 'https://www.instagram.com/mlzidla/';
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const INSTAGRAM_QR_URL = `${SITE_URL}/media/instagram-mlzidla-qr.svg`;

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function encodeMessage({ to, subject, body, replyTo = '' }) {
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const message = [`To: ${to}`, 'From: MLŽIDLA.cz <me>', replyTo ? `Reply-To: ${replyTo}` : '', `Subject: ${encodedSubject}`, 'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', body].filter(Boolean).join('\r\n');
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
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: encodeMessage({ to, subject, body, replyTo: inquiry.email }) }) });
      return { to, ok: response.ok };
    }));

    const projectSummary = inquiry.project_scope || inquiry.product_interest || inquiry.product_id || 'Projekt mlžení';
    const customerBody = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eef3f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center" style="padding:28px 14px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;background:#fff;border:1px solid #dbe5e7;border-radius:22px;overflow:hidden"><tr><td style="background:#0d2d38;padding:28px 34px"><table width="100%"><tr><td><img src="${LOGO_URL}" width="190" alt="MLŽIDLA" style="display:block;width:190px;max-width:72%;height:auto"></td><td align="right" style="font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:#8bcfda">Potvrzení poptávky</td></tr></table></td></tr><tr><td style="padding:36px 34px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700">Poptávka byla přijata</div><h1 style="margin:10px 0 14px;font-size:28px;color:#0d2d38">Děkujeme, ${escapeHtml(inquiry.name || '')}.</h1><p style="margin:0;font-size:15px;line-height:1.7;color:#50666c">Vaši zprávu jsme přijali a předali technickému týmu. Níže uvádíme shrnutí podkladů, ze kterých budeme vycházet při dalším kontaktu a případném nacenění.</p><div style="margin:24px 0;padding:20px;border:1px solid #e1e9ea;border-radius:16px;background:#f5f8f8"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#6e858b;margin-bottom:8px">Shrnutí vaší poptávky k nacenění</div><div style="font-size:17px;font-weight:700;color:#17343d">${escapeHtml(projectSummary)}</div>${inquiry.message ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #dde7e9;font-size:13px;line-height:1.65;color:#5f747a">${escapeHtml(inquiry.message).replace(/\n/g, '<br>')}</div>` : ''}</div><h2 style="margin:0 0 14px;font-size:20px;color:#0d2d38">Co bude následovat</h2><p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#50666c">Prověříme zadání, vhodné řešení a dostupné podklady. Pokud bude potřeba doplnit rozměry, fotografii prostoru, napojení vody, kotvení nebo termín realizace, ozveme se vám. Následně připravíme doporučení a podle rozsahu projektu cenovou nabídku.</p><div style="padding:22px;border-radius:16px;background:#0d2d38;color:#fff"><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#61d5e5">Technický kontakt</div><div style="margin-top:6px;font-size:19px;font-weight:700">Ing. Radek Meduna</div><div style="margin-top:10px;font-size:13px;line-height:1.8;color:#cce4e8"><a href="tel:+420774700390" style="color:#fff;text-decoration:none">${PHONE}</a><br><a href="mailto:${CONTACT_EMAIL}" style="color:#61d5e5;text-decoration:none">${CONTACT_EMAIL}</a><br><a href="mailto:${INFO_EMAIL}" style="color:#61d5e5;text-decoration:none">${INFO_EMAIL}</a></div></div><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:24px"><tr><td><div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#7c9095">Sledujte realizace</div><div style="margin-top:6px;font-size:17px;font-weight:700;color:#0d2d38">MLŽIDLA® na Instagramu</div><a href="${INSTAGRAM_URL}" style="display:inline-block;margin-top:8px;color:#0e7584;text-decoration:none;font-size:13px;font-weight:700">@mlzidla →</a></td><td width="112" align="right"><a href="${INSTAGRAM_URL}"><img src="${INSTAGRAM_QR_URL}" width="100" height="100" alt="Instagram MLŽIDLA" style="display:block;width:100px;height:100px;border:1px solid #e1e9ea;border-radius:12px;padding:5px;background:#fff"></a></td></tr></table></td></tr><tr><td align="center" style="padding:22px;background:#f5f8f8;border-top:1px solid #e1e9ea;color:#7a8d92;font-size:11px;line-height:1.6">MLŽIDLA® / HolmTec s.r.o. · Trutnov · Česká republika · <a href="${SITE_URL}" style="color:#0e7584;text-decoration:none">mlzidla.cz</a></td></tr></table></td></tr></table></body></html>`;
    const customerResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: encodeMessage({ to: inquiry.email, subject: 'Poptávku jsme přijali | MLŽIDLA®', body: customerBody, replyTo: CONTACT_EMAIL }) }),
    });
    const customerResult = { to: inquiry.email, ok: customerResponse.ok };
    if (results.some((result) => !result.ok) || !customerResult.ok) return Response.json({ error: 'Notification delivery failed', results, customerResult }, { status: 500 });
    return Response.json({ ok: true, results, customerResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}