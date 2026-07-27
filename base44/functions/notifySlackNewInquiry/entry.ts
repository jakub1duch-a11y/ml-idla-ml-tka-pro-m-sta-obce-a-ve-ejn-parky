import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SLACK_CHANNEL_ID = 'C0BG53VBBV1'; // #all-mlidlacz

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { event, data } = body;

    if (!data) {
      return Response.json({ error: 'No data provided' }, { status: 400 });
    }

    let name = '—';
    let email = '—';
    let phone = '';
    let message = '—';

    if (event.entity_name === 'Poptavka') {
      name = data.jmeno || '—';
      email = data.email || '—';
      phone = data.telefon || '';
      message = data.zprava || '—';
    } else {
      name = data.name || '—';
      email = data.email || '—';
      message = data.message || '—';
    }

    const text = `🌫️ *Nová poptávka z mlzidla.cz*\n*Jméno:* ${name}\n*Email:* ${email}${phone ? `\n*Telefon:* ${phone}` : ''}\n*Zpráva:* ${message}`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');

    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: SLACK_CHANNEL_ID,
        text,
        username: 'Mlzidla.cz Poptávky',
        icon_emoji: ':cloud:',
      }),
    });
    const result = await res.json();

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});