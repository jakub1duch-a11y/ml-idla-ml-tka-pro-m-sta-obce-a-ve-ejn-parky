import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import MailComposer from 'npm:mailcomposer@4.0.2';

const base64Url = (bytes) => {
  let binary = '';
  new Uint8Array(bytes).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const buildMessage = (options) => new Promise((resolve, reject) => {
  new MailComposer(options).compile().build((error, message) => error ? reject(error) : resolve(message));
});

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { inquiry_type: inquiryType, inquiry_id: inquiryId, subject, message, quote_pdf_base64: quotePdfBase64, quote_filename: quoteFilename, attachments = [] } = await req.json();
    if (!inquiryType || !inquiryId || !subject || !message) return Response.json({ error: 'Missing reply details' }, { status: 400 });

    const entityName = inquiryType === 'contact' ? 'ContactInquiry' : 'Poptavka';
    let inquiry;
    try {
      inquiry = await base44.asServiceRole.entities[entityName].get(inquiryId);
    } catch (_) {
      return Response.json({ error: 'Inquiry recipient not found' }, { status: 404 });
    }
    if (!inquiry?.email) return Response.json({ error: 'Inquiry recipient not found' }, { status: 404 });

    const externalAttachments = await Promise.all(attachments.slice(0, 5).map(async (file) => {
      const response = await fetch(file.file_url);
      if (!response.ok) throw new Error(`Attachment unavailable: ${file.file_name}`);
      return { filename: file.file_name, content: new Uint8Array(await response.arrayBuffer()) };
    }));
    const quoteAttachment = quotePdfBase64 ? [{ filename: quoteFilename || 'nabidka-mlzidla.pdf', content: Uint8Array.from(atob(quotePdfBase64), (character) => character.charCodeAt(0)), contentType: 'application/pdf' }] : [];
    const html = `<div style="font-family:Arial,sans-serif;color:#19313b;line-height:1.6;white-space:pre-line">${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    const raw = await buildMessage({ from: 'MLŽIDLA® <me>', to: inquiry.email, subject, text: message, html, attachments: [...quoteAttachment, ...externalAttachments] });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: base64Url(raw) }) });
    if (!response.ok) return Response.json({ error: 'Message delivery failed' }, { status: 502 });

    const status = inquiryType === 'contact' ? 'contacted' : 'v_reseni';
    await base44.asServiceRole.entities[entityName].update(inquiryId, { status });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}