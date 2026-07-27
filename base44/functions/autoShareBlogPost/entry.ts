import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_URL = 'https://mlzidla.cz';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { event } = await req.json();
    if (!event || event.entity_name !== 'BlogPost' || !event.entity_id) {
      return Response.json({ ok: false, reason: 'Missing BlogPost event id' }, { status: 400 });
    }

    const post = await base44.asServiceRole.entities.BlogPost.get(event.entity_id);

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

    // Instagram needs time to fetch/process the image before it can be published.
    // Poll the container status until it's FINISHED (or fail fast on ERROR).
    let statusCode = 'IN_PROGRESS';
    for (let attempt = 0; attempt < 10 && statusCode === 'IN_PROGRESS'; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const statusRes = await fetch(`https://graph.instagram.com/${container.id}?fields=status_code&access_token=${accessToken}`);
      const statusData = await statusRes.json();
      statusCode = statusData.status_code;
    }
    if (statusCode !== 'FINISHED') {
      return Response.json({ error: { message: `Media container not ready (status: ${statusCode})` } }, { status: 400 });
    }

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