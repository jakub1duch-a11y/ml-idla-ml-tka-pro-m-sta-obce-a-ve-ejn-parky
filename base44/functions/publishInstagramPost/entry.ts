import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CONNECTOR_ID = '6a48154c19f44e6e0269b046';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { postId } = await req.json();
    if (!postId) return Response.json({ error: 'Missing postId' }, { status: 400 });

    const post = await base44.asServiceRole.entities.MarketingPost.get(postId);
    if (!post) return Response.json({ error: 'Příspěvek nenalezen' }, { status: 404 });
    if (!post.image_url) return Response.json({ error: 'Příspěvek musí mít obrázek' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);

    const meRes = await fetch(`https://graph.instagram.com/me?fields=id&access_token=${accessToken}`);
    const me = await meRes.json();
    if (!meRes.ok) return Response.json({ error: me }, { status: meRes.status });

    const containerRes = await fetch(`https://graph.instagram.com/${me.id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: post.image_url,
        caption: post.caption || '',
        access_token: accessToken,
      }),
    });
    const container = await containerRes.json();
    if (!containerRes.ok) return Response.json({ error: container }, { status: containerRes.status });

    const publishRes = await fetch(`https://graph.instagram.com/${me.id}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: accessToken,
      }),
    });
    const published = await publishRes.json();
    if (!publishRes.ok) return Response.json({ error: published }, { status: publishRes.status });

    await base44.asServiceRole.entities.MarketingPost.update(postId, { status: 'published' });

    return Response.json({ success: true, media_id: published.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});