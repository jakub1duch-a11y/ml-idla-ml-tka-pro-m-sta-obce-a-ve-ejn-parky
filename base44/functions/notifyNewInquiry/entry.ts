import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const RECIPIENTS = [
  'Meduna@holmtec.cz',
  'obchod1@holmtec.cz',
  'jakub1duch@gmail.com',
  'duch@holmtec.cz',
  'duchmatej@holmtec.cz',
];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function encodeRFC2047(str) {
  const encoded = btoa(unescape(encodeURIComponent(str)));
  return `=?UTF-8?B?${encoded}?=`;
}

function buildMimeMessage({ from, to, subject, body }) {
  const encodedSubject = encodeRFC2047(subject);
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    body,
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { data } = body;

    if (!data) {
      return Response.json({ error: 'No data provided' }, { status: 400 });
    }

    // Only send email to the address provided in the inquiry (not arbitrary addresses)
    const name = escapeHtml(data.name || 'Neznámý');
    const email = escapeHtml(data.email || '—');
    const message = escapeHtml(data.message || '—');
    const rawEmail = data.email || '';
    const createdAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    const subject = `Nová poptávka MLŽIDLA.CZ — ${name}`;
    const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e2e8f0;padding:32px;border-radius:12px;">
  <div style="border-bottom:1px solid #1e2a3a;padding-bottom:20px;margin-bottom:24px;">
    <h1 style="color:#22d3ee;font-size:20px;margin:0;">&#127807; Nová poptávka HolmTec</h1>
    <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Přijato: ${createdAt}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:100px;">Jméno</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(rawEmail)}" style="color:#22d3ee;">${email}</a></td></tr>
  </table>
  <div style="margin-top:20px;padding:16px;background:#131c27;border-radius:8px;border-left:3px solid #22d3ee;">
    <p style="color:#64748b;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Zpráva</p>
    <p style="margin:0;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <div style="margin-top:24px;">
    <a href="mailto:${encodeURIComponent(rawEmail)}?subject=Re: Poptávka mlžného systému Mlzidla.cz" style="display:inline-block;background:#22d3ee;color:#0d1117;padding:12px 24px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px;">Odpovědět zájemci</a>
  </div>
</div>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const sendEmail = async (to, emailSubject, emailBody) => {
      const raw = buildMimeMessage({ from: 'Mlzidla.cz Notifikace <me>', to, subject: emailSubject, body: emailBody });
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw }),
      });
      return { to, status: res.status, ok: res.ok };
    };

    // Notifikace internímu týmu
    const teamResults = await Promise.all(RECIPIENTS.map(to => sendEmail(to, subject, htmlBody)));

    // Potvrzovací email klientovi
    const clientSubject = `Vaši poptávku jsme přijali — Mlžidla.cz`;
    const clientBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e2e8f0;padding:32px;border-radius:12px;">
  <div style="border-bottom:1px solid #1e2a3a;padding-bottom:20px;margin-bottom:24px;">
    <h1 style="color:#22d3ee;font-size:22px;margin:0;">Děkujeme za vaši poptávku</h1>
    <p style="color:#64748b;font-size:13px;margin:6px 0 0;">HolmTec — Mlžné sochy a instalace</p>
  </div>
  <p style="line-height:1.7;">Dobrý den, <strong>${name}</strong>,</p>
  <p style="line-height:1.7;color:#cbd5e1;">obdrželi jsme vaši poptávku a děkujeme za váš zájem o naše mlžné systémy. Náš tým ji nyní zpracovává a brzy se vám ozveme — obvykle do 1–2 pracovních dnů.</p>
  <div style="margin:24px 0;padding:16px;background:#131c27;border-radius:8px;border-left:3px solid #22d3ee;">
    <p style="color:#64748b;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Vaše zpráva</p>
    <p style="margin:0;line-height:1.7;color:#94a3b8;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <p style="line-height:1.7;color:#cbd5e1;">V případě dotazů nás můžete kontaktovat přímo na <a href="mailto:obchod1@holmtec.cz" style="color:#22d3ee;">obchod1@holmtec.cz</a> nebo na tel. <a href="tel:+420774700390" style="color:#22d3ee;">+420 777 880 099</a>.</p>
  <div style="margin-top:28px;padding-top:20px;border-top:1px solid #1e2a3a;color:#475569;font-size:12px;">
    <p style="margin:0;">Mlžidla.cz - HolmTec s.r.o. &nbsp;|&nbsp; Mlžné sochy &amp; instalace &nbsp;|&nbsp; <a href="https://www.holmtec.cz" style="color:#22d3ee;">mlzidla.cz</a></p>
  </div>
</div>`;

    const clientResult = rawEmail ? await sendEmail(rawEmail, clientSubject, clientBody) : { skipped: true };

    return Response.json({ ok: true, teamResults, clientResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});