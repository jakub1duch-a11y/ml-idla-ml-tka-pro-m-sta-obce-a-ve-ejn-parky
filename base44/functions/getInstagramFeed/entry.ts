import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const CONNECTOR_ID = '6a48154c19f44e6e0269b046';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);

    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const me = await meRes.json();
    if (!meRes.ok) return Response.json({ error: me }, { status: meRes.status });

    const mediaRes = await fetch(
      `https://graph.instagram.com/${me.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();
    if (!mediaRes.ok) return Response.json({ error: mediaData }, { status: mediaRes.status });

    const posts = (mediaData.data || []).map((p) => ({
      instagram_id: p.id,
      caption: p.caption || '',
      media_type: p.media_type,
      media_url: p.media_url,
      thumbnail_url: p.thumbnail_url || '',
      permalink: p.permalink,
      posted_at: p.timestamp,
    }));

    // Cache posts so the public site can display them without requiring a login
    const existing = await base44.asServiceRole.entities.InstagramPost.list();
    const existingByIgId = new Map(existing.map((e) => [e.instagram_id, e]));

    for (const post of posts) {
      const match = existingByIgId.get(post.instagram_id);
      if (match) {
        await base44.asServiceRole.entities.InstagramPost.update(match.id, post);
      } else {
        await base44.asServiceRole.entities.InstagramPost.create(post);
      }
    }

    return Response.json({ username: me.username, posts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});