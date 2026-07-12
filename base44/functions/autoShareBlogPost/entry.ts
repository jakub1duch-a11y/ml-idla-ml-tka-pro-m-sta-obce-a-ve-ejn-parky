import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_URL = 'https://mlzidla.cz';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data, payload_too_large } = await req.json();

    if (!event || event.entity_name !== 'BlogPost') {
      return Response.json({ ok: false, reason: 'Not a BlogPost event' });
    }

    let post = data;
    if (payload_too_large || !post) {
      post = await base44.asServiceRole.entities.BlogPost.get(event.entity_id);
    }

    if (!post || !post.published || post.instagram_posted) {
      return Response.json({ ok: false, reason: 'Post not published or already shared' });
    }
    if (!post.image_url) {
      return Response.json({ ok: false, reason: 'Post has no image, Instagram requires one' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');

    const meRes = await fetch(`https://graph.instagram.com/me?fields=id&access_token=${accessToken}`);
    const me = await meRes.json();
    if (!meRes.ok) return Response.json({ error: me }, { status: meRes.status });

    const link = `${BASE_URL}/blog/${post.slug || post.id}`;
    const caption = `${post.title}\n\n${post.perex || ''}\n\nČtěte více na ${link}\n\n#mlzeni #mlzidla #holmtec #chlazeni #mlznesochy`;

    const containerRes = await fetch(`https://graph.instagram.com/${me.id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: post.image_url,
        caption,
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

    await base44.asServiceRole.entities.BlogPost.update(post.id, { instagram_posted: true });

    return Response.json({ ok: true, media_id: published.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});