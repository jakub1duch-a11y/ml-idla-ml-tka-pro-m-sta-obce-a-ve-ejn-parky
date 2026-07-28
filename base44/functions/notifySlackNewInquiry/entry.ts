import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SLACK_CHANNEL_ID = 'C0BG53VBBV1';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const entityId = body?.event?.entity_id || body?.data?.id;
    if (!entityId) return Response.json({ error: 'Missing inquiry id' }, { status: 400 });

    const inquiry = await base44.asServiceRole.entities.Poptavka.get(entityId);
    if (!inquiry) return Response.json({ error: 'Not found' }, { status: 404 });
    const text = `🌫️ *Nová poptávka z mlzidla.cz*\n*Jméno:* ${inquiry.jmeno || '—'}\n*Email:* ${inquiry.email || '—'}${inquiry.telefon ? `\n*Telefon:* ${inquiry.telefon}` : ''}\n*Zpráva:* ${inquiry.zprava || '—'}`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');
    const res = await fetch('https://slack.com/api/chat.postMessage', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ channel: SLACK_CHANNEL_ID, text, username: 'Mlzidla.cz Poptávky', icon_emoji: ':cloud:' }) });
    const result = await res.json();
    if (!result.ok) return Response.json({ error: result.error }, { status: 500 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}