import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const toBase64 = (bytes) => {
  let binary = '';
  new Uint8Array(bytes).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};
const base64Url = (bytes) => toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const encodeHeader = (value) => `=?UTF-8?B?${toBase64(new TextEncoder().encode(value))}?=`;
const safeFilename = (value) => String(value || 'priloha').replace(/["\\\r\n]/g, '_');

const buildMessage = ({ to, subject, text, attachments }) => {
  const boundary = `mlzidla-${crypto.randomUUID()}`;
  const lines = [
    `From: ${encodeHeader('MLŽIDLA®')} <me>`,
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    toBase64(new TextEncoder().encode(text))
  ];
  attachments.forEach((attachment) => {
    lines.push(`--${boundary}`, `Content-Type: ${attachment.contentType || 'application/octet-stream'}; name="${safeFilename(attachment.filename)}"`, 'Content-Transfer-Encoding: base64', `Content-Disposition: attachment; filename="${safeFilename(attachment.filename)}"`, '', toBase64(attachment.content));
  });
  lines.push(`--${boundary}--`, '');
  return new TextEncoder().encode(lines.join('\r\n'));
};

const signature = `S pozdravem,\ntým technické podpory Mlžidla.cz\n\nIng. Radek Meduna\nTel.: +420 774 700 390\nE-mail pro objednávku:\n- meduna@holmtec.cz\n- info@mlzidla.cz`;
const withSignature = (text) => text.includes('tým technické podpory Mlžidla.cz') ? text.trim() : `${text.trim()}\n\n${signature}`;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { inquiry_type: inquiryType, inquiry_id: inquiryId, subject, message: draftMessage, quote_pdf_base64: quotePdfBase64, quote_filename: quoteFilename, presentation_pdf_base64: presentationPdfBase64, presentation_filename: presentationFilename, attachments = [] } = await req.json();
    if (!inquiryType || !inquiryId || !subject || !draftMessage) return Response.json({ error: 'Missing reply details' }, { status: 400 });
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
    const clientRaw = buildMessage({ to: inquiry.email, subject, text: message, attachments: allAttachments });
    const copyRecipients = ['meduna@holmtec.cz', 'jakub1duch@gmail.com'];
    const copySubject = `Kopie nabídky pro ${inquiry.name}: ${subject}`;
    const copyText = `Kopie odeslané nabídky pro klienta ${inquiry.name} (${inquiry.email}).\n\n${message}`;
    const copyRaw = buildMessage({ to: copyRecipients.join(', '), subject: copySubject, text: copyText, attachments: allAttachments });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const send = (raw) => fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: base64Url(raw) }) });
    const [clientResponse, copyResponse] = await Promise.all([send(clientRaw), send(copyRaw)]);
    if (!clientResponse.ok || !copyResponse.ok) return Response.json({ error: 'Message delivery failed' }, { status: 502 });

    await base44.asServiceRole.entities[entityName].update(inquiryId, { status: inquiryType === 'contact' ? 'contacted' : 'v_reseni' });
    return Response.json({ ok: true });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}