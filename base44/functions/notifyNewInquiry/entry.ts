import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const RECIPIENTS = [
  'Meduna@holmtec.cz',
  'obchod1@holmtec.cz',
  'jakub1duch@gmail.com',
];

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
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return Response.json({ error: 'No data provided' }, { status: 400 });
    }

    const name = data.name || 'Neznámý';
    const email = data.email || '—';
    const message = data.message || '—';
    const createdAt = new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' });

    const subject = `Nová poptávka HolmTec — ${name}`;
    const htmlBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e2e8f0;padding:32px;border-radius:12px;">
  <div style="border-bottom:1px solid #1e2a3a;padding-bottom:20px;margin-bottom:24px;">
    <h1 style="color:#22d3ee;font-size:20px;margin:0;">&#127807; Nová poptávka HolmTec</h1>
    <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Přijato: ${createdAt}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:100px;">Jméno</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#22d3ee;">${email}</a></td></tr>
  </table>
  <div style="margin-top:20px;padding:16px;background:#131c27;border-radius:8px;border-left:3px solid #22d3ee;">
    <p style="color:#64748b;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Zpráva</p>
    <p style="margin:0;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <div style="margin-top:24px;">
    <a href="mailto:${email}?subject=Re: Poptávka mlžného systému HolmTec" style="display:inline-block;background:#22d3ee;color:#0d1117;padding:12px 24px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px;">Odpovědět zájemci</a>
  </div>
</div>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const results = await Promise.all(RECIPIENTS.map(async (to) => {
      const raw = buildMimeMessage({
        from: 'HolmTec Notifikace <me>',
        to,
        subject,
        body: htmlBody,
      });

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw }),
      });

      return { to, status: res.status, ok: res.ok };
    }));

    return Response.json({ ok: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});