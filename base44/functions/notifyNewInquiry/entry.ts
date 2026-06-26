import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const RECIPIENTS = [
  'Meduna@holmtec.cz',
  'obchod1@holmtec.cz',
  'jakub1duch@gmail.com',
];

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

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
    const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d1117;color:#e2e8f0;padding:32px;border-radius:12px;">
  <div style="border-bottom:1px solid #1e2a3a;padding-bottom:20px;margin-bottom:24px;">
    <h1 style="color:#22d3ee;font-size:20px;margin:0;">🌿 Nová poptávka HolmTec</h1>
    <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Přijato: ${createdAt}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:120px;">Jméno</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#22d3ee;">${email}</a></td></tr>
  </table>
  <div style="margin-top:20px;padding:16px;background:#131c27;border-radius:8px;border-left:3px solid #22d3ee;">
    <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Zpráva</p>
    <p style="margin:0;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <div style="margin-top:24px;">
    <a href="mailto:${email}?subject=Re: Poptávka mlžného systému" style="display:inline-block;background:#22d3ee;color:#0d1117;padding:12px 24px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px;">Odpovědět zájemci</a>
  </div>
</div>`;

    if (!RESEND_API_KEY) {
      return Response.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
    }

    const results = await Promise.all(RECIPIENTS.map(to =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'HolmTec <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
        }),
      }).then(r => r.json())
    ));

    return Response.json({ ok: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});