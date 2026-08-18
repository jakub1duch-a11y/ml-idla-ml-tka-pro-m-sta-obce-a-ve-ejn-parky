import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { findSmartControlPricing } from '../../shared/pricingSheet.ts';

const ALLOWED_SENDERS = ['meduna@holmtec.cz', 'info@mlzidla.cz'];
const FIXED_BCC = ['jakub1duch@gmail.com', 'duch@holmtec.cz', 'meduna@holmtec.cz'];
const SITE_URL = 'https://mlzidla.cz';
const INSTAGRAM_URL = 'https://www.instagram.com/mlzidla/';
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const INSTAGRAM_QR_URL = `${SITE_URL}/media/instagram-mlzidla-qr.svg`;
const PHONE = '+420 774 700 390';

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

function buildHtml({ message, portalUrl, presentationUrl, quotePdfUrl, validUntil, quoteNumber, projectSummary = '', emailType = 'offer', discountPercent = 0, previousTotal = 0, newTotal = 0, visualizationItems = [], smartPricing = {} }) {
  const paragraphs = escapeHtml(message).split(/\n{2,}/).map((p) => `<p style="margin:0 0 14px;line-height:1.7;color:#50666c;font-size:14px">${p.replace(/\n/g, '<br>')}</p>`).join('');
  const button = (label, url, bg, color = '#ffffff') => url ? `<a href="${escapeHtml(url)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:${bg};color:${color};text-decoration:none;font-weight:700;font-size:13px">${escapeHtml(label)}</a>` : '';
  const orderUrl = portalUrl ? `${portalUrl}${portalUrl.includes('?') ? '&' : '?'}action=order${quoteNumber ? `&quote=${encodeURIComponent(quoteNumber)}` : ''}` : '';
  const extendUrl = portalUrl ? `${portalUrl}${portalUrl.includes('?') ? '&' : '?'}action=extend${quoteNumber ? `&quote=${encodeURIComponent(quoteNumber)}` : ''}` : '';
  const timingUrl = portalUrl ? `${portalUrl}${portalUrl.includes('?') ? '&' : '?'}action=timing${quoteNumber ? `&quote=${encodeURIComponent(quoteNumber)}` : ''}` : '';
  const typeLabel = emailType === 'action_discount' ? 'Akční navázání na nabídku' : emailType === 'offer_reminder' ? 'Připomenutí cenové nabídky' : emailType === 'inquiry_reminder' ? 'Navazujeme na vaši poptávku' : 'Nabídka projektu';
  const hasOfferActions = Boolean(quoteNumber || presentationUrl || quotePdfUrl);
  const summaryBlock = projectSummary ? `<div style="margin:22px 0;padding:18px 20px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e858b;margin-bottom:8px">Shrnutí vašeho projektu</div><div style="font-size:13px;line-height:1.65;color:#5f747a">${escapeHtml(projectSummary).replace(/\n/g, '<br>')}</div></div>` : '';
  const promoBlock = emailType === 'action_discount' && Number(discountPercent) > 0 && Number(previousTotal) > 0 ? `<div style="margin:22px 0;padding:20px;background:#e9f8fa;border:1px solid #bfe8ee;border-radius:16px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;margin-bottom:9px">Akční zvýhodnění k předchozí nabídce</div><div style="font-size:15px;line-height:1.6;color:#17343d">Původní nabídková cena: <strong>${Number(previousTotal).toLocaleString('cs-CZ')} Kč bez DPH</strong><br>Navržená sleva: <strong>${Number(discountPercent).toLocaleString('cs-CZ')} %</strong><br>Akční cena: <strong style="color:#0e5b67">${Number(newTotal).toLocaleString('cs-CZ')} Kč bez DPH</strong>${validUntil ? `<br>Platnost zvýhodnění do: <strong>${escapeHtml(validUntil)}</strong>` : ''}</div><div style="margin-top:10px;font-size:12px;line-height:1.55;color:#60777d">Zvýhodnění navazuje na dříve dodanou nabídku. Po potvrzení zájmu připravíme aktualizovanou formální cenovou nabídku.</div></div>` : '';
  const offerBlock = hasOfferActions ? `<div style="margin:24px 0 8px;padding:20px;border-radius:16px;background:#f5f8f8;border:1px solid #e1e9ea"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e858b;margin-bottom:12px">Interaktivní nabídka${quoteNumber ? ` · ${escapeHtml(quoteNumber)}` : ''}${validUntil ? ` · platnost do ${escapeHtml(validUntil)}` : ''}</div>${button('Souhlasím a objednávám', orderUrl, '#0e5b67')}${button('Požádat o prodloužení platnosti', extendUrl, '#475569')}${button('Uvést přibližný termín objednání', timingUrl, '#dff7fa', '#0d2d38')}${button('Otevřít prezentaci projektu', presentationUrl, '#61d5e5', '#0d2d38')}${button('Otevřít PDF nabídku', quotePdfUrl, '#ffffff', '#0e5b67')}<p style="margin:10px 0 0;color:#7a8d92;font-size:11px;line-height:1.55">Závazná objednávka vzniká až potvrzením nabídky a obchodních podmínek.</p></div>` : '';
  const visualBlock = visualizationItems.length ? `<div style="margin:28px 0"><div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#0e7584;margin-bottom:10px">Projektová vizualizace</div>${visualizationItems.map((item, index) => `<div style="margin:0 0 16px;border:1px solid #dde7e8;background:#ffffff;overflow:hidden"><a href="${escapeHtml(item.file_url)}" style="text-decoration:none"><img src="${escapeHtml(item.file_url)}" alt="${escapeHtml(item.title || 'Vizualizace projektu')}" style="display:block;width:100%;height:auto;border:0"><div style="padding:11px 14px;font-size:${index === 0 ? '13px' : '12px'};font-weight:700;color:#17343d">${escapeHtml(item.title || 'Vizualizace projektu')}</div></a></div>`).join('')}</div>` : '';
  const waterManagementPrice = Number(smartPricing.component_water_meter_ex_vat || 0) + Number(smartPricing.component_liw01_ex_vat || 0);
  const smartRows = [
    smartPricing.component_wifi_valve_ex_vat > 0 && ['PEVEKO SMART SUPLA Wi‑Fi ventil', Number(smartPricing.component_wifi_valve_ex_vat)],
    smartPricing.component_row02_ex_vat > 0 && ['SUPLA ROW‑02 · Wi‑Fi spínací modul', Number(smartPricing.component_row02_ex_vat)],
    waterManagementPrice > 0 && ['Měření + správa spotřeby vody · ENBRA + LIW‑01', waterManagementPrice],
    smartPricing.component_thw01_ex_vat > 0 && ['Teplota + vlhkost · THW‑01', Number(smartPricing.component_thw01_ex_vat)],
    smartPricing.complete_supla_ex_vat > 0 && ['Kompletní projektové SUPLA řízení', Number(smartPricing.complete_supla_ex_vat)],
  ].filter(Boolean);
  const smartBlock = emailType === 'offer' && smartRows.length ? `<div style="margin:28px 0;padding:22px;border:1px solid #d9e5e7;background:#f8fbfb"><div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#0e7584">Smart řízení projektu</div><div style="margin-top:7px;font-size:21px;line-height:1.25;font-weight:700;color:#102f39">SUPLA jako provozní vrstva mlžítek.</div><div style="margin-top:10px;font-size:13px;line-height:1.7;color:#60777d">Vzdálená správa, libovolné časové harmonogramy a cykly, automatické scénáře podle teploty nebo vlhkosti, měření spotřeby vody, více zón a volitelná návaznost na externí API počasí. Konkrétní logiku nastavíme podle provozu daného místa.</div><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:16px;border-collapse:collapse">${smartRows.map(([label, price]) => `<tr><td style="padding:10px 0;border-top:1px solid #e2eaeb;font-size:12px;color:#456069">${escapeHtml(label)}</td><td align="right" style="padding:10px 0;border-top:1px solid #e2eaeb;font-size:12px;font-weight:700;color:#0d4958;white-space:nowrap">${Number(price).toLocaleString('cs-CZ')} Kč bez DPH</td></tr>`).join('')}</table><div style="margin-top:9px;font-size:11px;line-height:1.55;color:#839499">Integrace externího API počasí a nestandardní automatizační scénáře se nacení podle rozsahu projektu.</div></div>` : '';

  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f2f5f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f2f5f4"><tr><td align="center" style="padding:28px 14px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:700px;background:#ffffff;border:1px solid #dfe7e7"><tr><td style="height:5px;background:#2bbfcf;font-size:0;line-height:0">&nbsp;</td></tr><tr><td style="padding:30px 36px 22px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td><img src="${LOGO_URL}" width="205" alt="MLŽIDLA" style="display:block;width:205px;max-width:72%;height:auto;border:0"></td><td align="right" valign="bottom" style="color:#6c858b;font-size:10px;letter-spacing:.16em;text-transform:uppercase">${typeLabel}</td></tr></table></td></tr><tr><td style="padding:12px 36px 38px">${paragraphs}${summaryBlock}${promoBlock}${visualBlock}${smartBlock}${offerBlock}<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:30px;border-top:1px solid #dfe7e7"><tr><td style="padding:22px 0 4px"><div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#0e7584;margin-bottom:7px">Projektový kontakt</div><div style="font-size:18px;font-weight:700;color:#17343d">Ing. Radek Meduna</div><div style="margin-top:8px;font-size:13px;line-height:1.8;color:#60777d"><a href="tel:+420774700390" style="color:#17343d;text-decoration:none">${PHONE}</a> · <a href="mailto:meduna@holmtec.cz" style="color:#0e7584;text-decoration:none">meduna@holmtec.cz</a><br><a href="${SITE_URL}" style="color:#0e7584;text-decoration:none">mlzidla.cz</a></div></td></tr></table></td></tr><tr><td align="center" style="background:#f8faf9;border-top:1px solid #e2e9e9;padding:20px 26px"><div style="font-size:12px;color:#526a70;font-weight:700">MLŽIDLA® / HolmTec s.r.o.</div><div style="margin-top:5px;font-size:11px;color:#899a9e">Architektonické mlžení · Trutnov · Česká republika</div></td></tr></table></td></tr></table></body></html>`;
}

const buildMessage = ({ to, bcc, fromEmail, subject, text, html, attachments }) => {
  const outer = `mlzidla-${crypto.randomUUID()}`;
  const alt = `alternative-${crypto.randomUUID()}`;
  const lines = [
    `From: ${encodeHeader('MLŽIDLA.cz by HolmTec')} <${fromEmail}>`,
    `Reply-To: ${fromEmail}`,
    `To: ${to}`,
    ...(bcc.length ? [`Bcc: ${bcc.join(', ')}`] : []),
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
      project_summary: projectSummary = '',
      email_type: emailType = 'offer',
      discount_percent: discountPercent = 0,
      previous_total: previousTotal = 0,
      new_total: newTotal = 0,
      attachments = [],
      test_email: testEmail = '',
      is_test: isTest = false
    } = await req.json();

    if (!inquiryType || !inquiryId || !subject || !draftMessage) return Response.json({ error: 'Missing reply details' }, { status: 400 });
    const senderEmail = ALLOWED_SENDERS.includes(requestedSender) ? requestedSender : 'meduna@holmtec.cz';
    const message = withSignature(draftMessage);
    const entityName = inquiryType === 'contact' ? 'ContactInquiry' : 'Poptavka';
    let inquiry;
    try { inquiry = await base44.asServiceRole.entities[entityName].get(inquiryId); } catch (_) { return Response.json({ error: 'Inquiry recipient not found' }, { status: 404 }); }
    if (!inquiry?.email) return Response.json({ error: 'Inquiry recipient not found' }, { status: 404 });

    const normalizedTestEmail = String(testEmail || '').trim().toLowerCase();
    if (isTest && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedTestEmail)) {
      return Response.json({ error: 'Invalid test email address' }, { status: 400 });
    }
    const recipientEmail = isTest ? normalizedTestEmail : inquiry.email;
    const messageSubject = isTest ? `[TEST MLŽIDLA] ${subject}` : subject;
    const bccRecipients = isTest ? [] : FIXED_BCC;

    const visualizationItems = (attachments || []).filter((file) => file?.asset_type === 'generated_visualization' && file?.file_url).slice(0, 3);
    const prioritizedAttachmentInputs = [
      ...visualizationItems,
      ...(attachments || []).filter((file) => file?.asset_type !== 'generated_visualization' && file?.file_url),
    ].slice(0, 5);
    const externalAttachments = await Promise.all(prioritizedAttachmentInputs.map(async (file) => {
      const response = await fetch(file.file_url);
      if (!response.ok) throw new Error(`Attachment unavailable: ${file.file_name}`);
      return { filename: file.file_name, content: new Uint8Array(await response.arrayBuffer()), contentType: response.headers.get('content-type') || 'application/octet-stream' };
    }));
    const quoteAttachment = quotePdfBase64 ? [{ filename: quoteFilename || 'nabidka-mlzidla.pdf', content: Uint8Array.from(atob(quotePdfBase64), (character) => character.charCodeAt(0)), contentType: 'application/pdf' }] : [];
    const presentationAttachment = presentationPdfBase64 ? [{ filename: presentationFilename || 'prezentace-mlzidla.pdf', content: Uint8Array.from(atob(presentationPdfBase64), (character) => character.charCodeAt(0)), contentType: 'application/pdf' }] : [];
    const allAttachments = [...quoteAttachment, ...presentationAttachment, ...externalAttachments];
    const smartPricing = await findSmartControlPricing(base44);
    const html = buildHtml({ message, portalUrl, presentationUrl, quotePdfUrl, validUntil: validUntil ? new Date(validUntil).toLocaleDateString('cs-CZ') : '', quoteNumber, projectSummary, emailType, discountPercent, previousTotal, newTotal, visualizationItems, smartPricing });
    const raw = buildMessage({ to: recipientEmail, bcc: bccRecipients, fromEmail: senderEmail, subject: messageSubject, text: message, html, attachments: allAttachments });

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

    if (!isTest) {
      await base44.asServiceRole.entities[entityName].update(inquiryId, { status: inquiryType === 'contact' ? 'contacted' : 'v_reseni' });
    }
    return Response.json({ ok: true, sender_email: senderEmail, recipient_email: recipientEmail, is_test: Boolean(isTest), bcc: bccRecipients });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
