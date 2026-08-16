import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const ALLOWED_SENDERS = ['meduna@holmtec.cz', 'info@mlzidla.cz'];
const FIXED_BCC = ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'];

const toBase64 = (bytes) => {
  let binary = '';
  new Uint8Array(bytes).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};
const base64Url = (bytes) => toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const encodeHeader = (value) => `=?UTF-8?B?${toBase64(new TextEncoder().encode(value))}?=`;
const safeFilename = (value) => String(value || 'priloha').replace(/["\\\r\n]/g, '_');
const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

const signature = `S pozdravem,\nMLŽIDLA.cz by HolmTec\n\nIng. Radek Meduna\n+420 774 700 390\nmeduna@holmtec.cz\ninfo@mlzidla.cz\nhttps://mlzidla.cz`;
const withSignature = (text) => text.includes('MLŽIDLA.cz by HolmTec') ? text.trim() : `${text.trim()}\n\n${signature}`;

function buildHtml({ message, portalUrl, presentationUrl, quotePdfUrl, validUntil, quoteNumber }) {
  const paragraphs = escapeHtml(message).split(/\n{2,}/).map((p) => `<p style="margin:0 0 14px;line-height:1.65;color:#334155">${p.replace(/\n/g, '<br>')}</p>`).join('');
  const button = (label, url, bg, color = '#ffffff') => url ? `<a href="${escapeHtml(url)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:${bg};color:${color};text-decoration:none;font-weight:700;font-size:13px">${escapeHtml(label)}</a>` : '';
  const orderUrl = portalUrl ? `${portalUrl}${portalUrl.includes('?') ? '&' : '?'}action=order${quoteNumber ? `&quote=${encodeURIComponent(quoteNumber)}` : ''}` : '';
  const extendUrl = portalUrl ? `${portalUrl}${portalUrl.includes('?') ? '&' : '?'}action=extend${quoteNumber ? `&quote=${encodeURIComponent(quoteNumber)}` : ''}` : '';
  const timingUrl = portalUrl ? `${portalUrl}${portalUrl.includes('?') ? '&' : '?'}action=timing${quoteNumber ? `&quote=${encodeURIComponent(quoteNumber)}` : ''}` : '';
  return `<!doctype html><html><body style="margin:0;background:#f4f7f8;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center" style="padding:24px"><table width="100%" style="max-width:680px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0"><tr><td style="background:#0A1628;padding:24px 28px;border-bottom:4px solid #2BBFCF"><div style="color:#2BBFCF;font-size:24px;font-weight:800;letter-spacing:.04em">MLŽIDLA.cz <span style="color:#94a3b8;font-size:12px;font-weight:600">by HolmTec</span></div><div style="color:#cbd5e1;margin-top:7px;font-size:12px">Profesionální nabídka řešení mlžení</div></td></tr><tr><td style="padding:28px">${paragraphs}<div style="margin:24px 0 8px;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0"><div style="font-size:12px;color:#64748b;margin-bottom:12px">INTERAKTIVNÍ NABÍDKA${validUntil ? ` · platnost do ${escapeHtml(validUntil)}` : ''}</div>${button('Souhlasím a objednávám', orderUrl, '#0B4860')}${button('Požádat o prodloužení platnosti', extendUrl, '#475569')}${button('Uvést přibližný termín objednání', timingUrl, '#e6f7f9', '#0A1628')}${button('Otevřít prezentaci projektu', presentationUrl, '#2BBFCF', '#0A1628')}${button('Otevřít PDF nabídku', quotePdfUrl, '#ffffff', '#0B4860')}</div><p style="margin:18px 0 0;color:#64748b;font-size:11px;line-height:1.55">Závazná objednávka vzniká až elektronickým potvrzením nabídky a obchodních podmínek v zákaznickém portálu. Po potvrzení navazuje výrobní příprava, technické upřesnění a plán realizace nebo dodání.</p></td></tr><tr><td style="padding:18px 28px;background:#0A1628;color:#94a3b8;font-size:11px;line-height:1.6">HolmTec s.r.o. · MLŽIDLA.cz<br>Ing. Radek Meduna · +420 774 700 390 · meduna@holmtec.cz · info@mlzidla.cz</td></tr></table></td></tr></table></body></html>`;
}

const buildMessage = ({ to, bcc, fromEmail, subject, text, html, attachments }) => {
  const outer = `mlzidla-${crypto.randomUUID()}`;
  const alt = `alternative-${crypto.randomUUID()}`;
  const lines = [
    `From: ${encodeHeader('MLŽIDLA.cz by HolmTec')} <${fromEmail}>`,
    `Reply-To: ${fromEmail}`,
    `To: ${to}`,
    `Bcc: ${bcc.join(', ')}`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${outer}"`,
    '',
    `--${outer}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    '',
    `--${alt}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    toBase64(new TextEncoder().encode(text)),
    `--${alt}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    toBase64(new TextEncoder().encode(html)),
    `--${alt}--`,
  ];
  attachments.forEach((attachment) => {
    lines.push(`--${outer}`, `Content-Type: ${attachment.contentType || 'application/octet-stream'}; name="${safeFilename(attachment.filename)}"`, 'Content-Transfer-Encoding: base64', `Content-Disposition: attachment; filename="${safeFilename(attachment.filename)}"`, '', toBase64(attachment.content));
  });
  lines.push(`--${outer}--`, '');
  return new TextEncoder().encode(lines.join('\r\n'));
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const {
      inquiry_type: inquiryType,
      inquiry_id: inquiryId,
      subject,
      message: draftMessage,
      sender_email: requestedSender,
      quote_pdf_base64: quotePdfBase64,
      quote_filename: quoteFilename,
      presentation_pdf_base64: presentationPdfBase64,
      presentation_filename: presentationFilename,
      presentation_url: presentationUrl = '',
      quote_pdf_url: quotePdfUrl = '',
      portal_url: portalUrl = 'https://mlzidla.cz/muj-projekt',
      valid_until: validUntil = '',
      quote_number: quoteNumber = '',
      attachments = []
    } = await req.json();

    if (!inquiryType || !inquiryId || !subject || !draftMessage) return Response.json({ error: 'Missing reply details' }, { status: 400 });
    const senderEmail = ALLOWED_SENDERS.includes(requestedSender) ? requestedSender : 'meduna@holmtec.cz';
    const message = withSignature(draftMessage);
    const entityName = inquiryType === 'contact' ? 'ContactInquiry' : 'Poptavka';
    let inquiry;
    try { inquiry = await base44.asServiceRole.entities[entityName].get(inquiryId); } catch (_) { return Response.json({ error: 'Inquiry recipient not found' }, { status: 404 }); }
    if (!inquiry?.email) return Response.json({ error: 'Inquiry recipient not found' }, { status: 404 });

    const externalAttachments = await Promise.all(attachments.slice(0, 5).map(async (file) => {
      const response = await fetch(file.file_url);
      if (!response.ok) throw new Error(`Attachment unavailable: ${file.file_name}`);
      return { filename: file.file_name, content: new Uint8Array(await response.arrayBuffer()), contentType: response.headers.get('content-type') || 'application/octet-stream' };
    }));
    const quoteAttachment = quotePdfBase64 ? [{ filename: quoteFilename || 'nabidka-mlzidla.pdf', content: Uint8Array.from(atob(quotePdfBase64), (character) => character.charCodeAt(0)), contentType: 'application/pdf' }] : [];
    const presentationAttachment = presentationPdfBase64 ? [{ filename: presentationFilename || 'prezentace-mlzidla.pdf', content: Uint8Array.from(atob(presentationPdfBase64), (character) => character.charCodeAt(0)), contentType: 'application/pdf' }] : [];
    const allAttachments = [...quoteAttachment, ...presentationAttachment, ...externalAttachments];
    const html = buildHtml({ message, portalUrl, presentationUrl, quotePdfUrl, validUntil: validUntil ? new Date(validUntil).toLocaleDateString('cs-CZ') : '', quoteNumber });
    const raw = buildMessage({ to: inquiry.email, bcc: FIXED_BCC, fromEmail: senderEmail, subject, text: message, html, attachments: allAttachments });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: base64Url(raw) })
    });
    if (!sendResponse.ok) {
      const detail = await sendResponse.text();
      return Response.json({ error: `Message delivery failed: ${detail}` }, { status: 502 });
    }

    await base44.asServiceRole.entities[entityName].update(inquiryId, { status: inquiryType === 'contact' ? 'contacted' : 'v_reseni' });
    return Response.json({ ok: true, sender_email: senderEmail, bcc: FIXED_BCC });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
