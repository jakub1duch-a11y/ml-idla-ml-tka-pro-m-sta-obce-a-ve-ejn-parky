// Sdílený modul pro profesionální zákaznické e-maily MLŽIDLA.cz
// Všechny e-maily mají konzistentní HTML + plaintext, brand identity, patičku s podpisem.

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';
const SITE_URL = 'https://mlzidla.cz';
const CONTACT_EMAIL = 'meduna@holmtec.cz';
const INFO_EMAIL = 'info@mlzidla.cz';
const CONTACT_PHONE = '+420 774 700 390';
const PORTAL_URL = `${SITE_URL}/klientska-sekce`;
const SUPPORT_URL = `${SITE_URL}/podpora`;
const KATALOG_URL = `${SITE_URL}/katalog-mlzitek`;
const POPTAVKA_URL = `${SITE_URL}/poptavka`;

export const BRAND = { LOGO_URL, SITE_URL, CONTACT_EMAIL, INFO_EMAIL, CONTACT_PHONE, PORTAL_URL, SUPPORT_URL, KATALOG_URL, POPTAVKA_URL };

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));

const SIGNATURE_TEXT = `S pozdravem,

Ing. Radek Meduna
MLŽIDLA.cz by HolmTec
${CONTACT_PHONE}
${CONTACT_EMAIL}
${INFO_EMAIL}
${SITE_URL}`;

const FOOTER_HTML = `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:30px;border-top:1px solid #dfe7e7">
<tr><td style="padding:22px 0 4px">
<div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#0e7584;margin-bottom:7px">Projektový kontakt</div>
<div style="font-size:18px;font-weight:700;color:#17343d">Ing. Radek Meduna</div>
<div style="margin-top:8px;font-size:13px;line-height:1.8;color:#60777d">
<a href="tel:${CONTACT_PHONE.replace(/\s/g,'')}" style="color:#17343d;text-decoration:none">${CONTACT_PHONE}</a> ·
<a href="mailto:${CONTACT_EMAIL}" style="color:#0e7584;text-decoration:none">${CONTACT_EMAIL}</a><br>
<a href="${SITE_URL}" style="color:#0e7584;text-decoration:none">mlzidla.cz</a> ·
<a href="${SUPPORT_URL}" style="color:#0e7584;text-decoration:none">Podpora</a> ·
<a href="${KATALOG_URL}" style="color:#0e7584;text-decoration:none">Katalog</a>
</div>
</td></tr></table>`;

const COMPANY_BAR = `<tr><td align="center" style="background:#f8faf9;border-top:1px solid #e2e9e9;padding:20px 26px">
<div style="font-size:12px;color:#526a70;font-weight:700">MLŽIDLA® / HolmTec s.r.o.</div>
<div style="margin-top:5px;font-size:11px;color:#899a9e">Architektonické mlžení · Trutnov · Česká republika</div>
</td></tr>`;

function ctaButton(label: string, url: string, bg: string, color = '#ffffff'): string {
  if (!url) return '';
  return `<a href="${escapeHtml(url)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:${bg};color:${color};text-decoration:none;font-weight:700;font-size:13px">${escapeHtml(label)}</a>`;
}

export interface EmailContent {
  typeLabel: string;
  title: string;
  greeting: string;
  bodyHtml: string;
  ctaButtons?: Array<{ label: string; url: string; bg?: string; color?: string }>;
  summaryBlock?: string;
}

export function buildEmailHtml(content: EmailContent): string {
  const paragraphs = content.bodyHtml;
  const buttons = (content.ctaButtons || []).map(b => ctaButton(b.label, b.url, b.bg || '#0e5b67', b.color || '#ffffff')).join('');
  const buttonBlock = buttons ? `<div style="margin:24px 0 8px;padding:20px;border-radius:16px;background:#f5f8f8;border:1px solid #e1e9ea">${buttons}<p style="margin:10px 0 0;color:#7a8d92;font-size:11px;line-height:1.55">Závazná potvrzení provádějte pouze v aplikaci MLŽIDLA.cz. Otevření e-mailu není potvrzení.</p></div>` : '';
  const summaryBlock = content.summaryBlock ? `<div style="margin:22px 0;padding:18px 20px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e858b;margin-bottom:8px">Shrnutí</div><div style="font-size:13px;line-height:1.65;color:#5f747a">${content.summaryBlock}</div></div>` : '';

  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f2f5f4;font-family:Arial,'Helvetica Neue',sans-serif;color:#10242b">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f2f5f4"><tr><td align="center" style="padding:28px 14px">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:700px;background:#ffffff;border:1px solid #dfe7e7">
<tr><td style="height:5px;background:#2bbfcf;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:30px 36px 22px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
<td><img src="${LOGO_URL}" width="205" alt="MLŽIDLA logo" style="display:block;width:205px;max-width:72%;height:auto;border:0"></td>
<td align="right" valign="bottom" style="color:#6c858b;font-size:10px;letter-spacing:.16em;text-transform:uppercase">${escapeHtml(content.typeLabel)}</td>
</tr></table></td></tr>
<tr><td style="padding:12px 36px 38px">
<h1 style="margin:0 0 14px;font-size:26px;color:#0d2d38">${escapeHtml(content.title)}</h1>
<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#50666c">${escapeHtml(content.greeting)}</p>
${paragraphs}
${summaryBlock}
${buttonBlock}
${FOOTER_HTML}
</td></tr>
${COMPANY_BAR}
</table>
</td></tr></table>
</body></html>`;
}

export function buildEmailText(content: EmailContent): string {
  const lines: string[] = [];
  lines.push(content.title);
  lines.push('');
  lines.push(content.greeting);
  lines.push('');
  // Strip HTML tags from bodyHtml for plaintext
  const plainBody = content.bodyHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"').trim();
  lines.push(plainBody);
  lines.push('');
  if (content.ctaButtons?.length) {
    content.ctaButtons.forEach(b => lines.push(`${b.label}: ${b.url}`));
    lines.push('');
  }
  lines.push(SIGNATURE_TEXT);
  return lines.join('\n');
}

// MIME message builder (compatible with Gmail API raw send)
const toBase64 = (bytes: Uint8Array) => { let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); };
const base64Url = (bytes: Uint8Array) => toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const utf8Base64 = (value: string) => toBase64(new TextEncoder().encode(value));
const encodeHeader = (value: string) => `=?UTF-8?B?${utf8Base64(value)}?=`;
const safeFilename = (value: string) => String(value || 'priloha').replace(/["\\\r\n]/g, '_');

export function buildMimeMessage(opts: { to: string; fromEmail: string; subject: string; text: string; html: string; bcc?: string[]; attachments?: Array<{ filename: string; content: Uint8Array; contentType?: string }> }): Uint8Array {
  const outer = `mlzidla-${crypto.randomUUID()}`;
  const alt = `alternative-${crypto.randomUUID()}`;
  const lines = [
    `From: ${encodeHeader('MLŽIDLA.cz by HolmTec')} <${opts.fromEmail}>`,
    `Reply-To: ${opts.fromEmail}`,
    `To: ${opts.to}`,
    ...(opts.bcc?.length ? [`Bcc: ${opts.bcc.join(', ')}`] : []),
    `Subject: ${encodeHeader(opts.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${outer}"`, '',
    `--${outer}`, `Content-Type: multipart/alternative; boundary="${alt}"`, '',
    `--${alt}`, 'Content-Type: text/plain; charset="UTF-8"', 'Content-Transfer-Encoding: base64', '', utf8Base64(opts.text),
    `--${alt}`, 'Content-Type: text/html; charset="UTF-8"', 'Content-Transfer-Encoding: base64', '', utf8Base64(opts.html),
    `--${alt}--`,
  ];
  (opts.attachments || []).forEach((a) => {
    lines.push(`--${outer}`, `Content-Type: ${a.contentType || 'application/octet-stream'}; name="${safeFilename(a.filename)}"`, 'Content-Transfer-Encoding: base64', `Content-Disposition: attachment; filename="${safeFilename(a.filename)}"`, '', toBase64(a.content));
  });
  lines.push(`--${outer}--`, '');
  return new TextEncoder().encode(lines.join('\r\n'));
}

export function mimeToBase64Url(bytes: Uint8Array): string {
  return base64Url(bytes);
}

export async function sendViaGmail(base44: any, opts: { to: string; fromEmail: string; subject: string; text: string; html: string; bcc?: string[] }): Promise<{ ok: boolean; error?: string }> {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const raw = buildMimeMessage(opts);
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: mimeToBase64Url(raw) }),
    });
    if (!res.ok) return { ok: false, error: `Gmail API ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error?.message || String(error) };
  }
}

export function buildSummaryBlock(fields: Array<[string, string | undefined]>): string {
  return fields.filter(([, v]) => v).map(([label, value]) => `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}`).join('<br>');
}