import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');

    let channels = [];
    let cursor = '';
    do {
      const url = `https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=200${cursor ? `&cursor=${cursor}` : ''}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await res.json();
      if (!data.ok) return Response.json({ error: data.error }, { status: 500 });
      channels = channels.concat(data.channels.map((c) => ({ id: c.id, name: c.name, is_member: c.is_member })));
      cursor = data.response_metadata?.next_cursor || '';
    } while (cursor);

    return Response.json({ channels });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});