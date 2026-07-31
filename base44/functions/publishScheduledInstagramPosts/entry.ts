import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { publishInstagramImage } from '../../shared/instagram.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { dryRun = false } = await req.json();
    const duePosts = await base44.asServiceRole.entities.MarketingPost.filter({
      platform: 'instagram',
      status: 'scheduled',
      scheduled_date: { $lte: new Date().toISOString() },
    });
    if (dryRun) return Response.json({ ok: true, due: duePosts.length, dryRun: true });
    if (duePosts.length === 0) return Response.json({ ok: true, published: 0, failed: [] });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const failed = [];
    let publishedCount = 0;
    for (const post of duePosts) {
      try {
        if (!post.image_url) throw new Error('Chybí obrázek');
        await publishInstagramImage(accessToken, post.image_url, post.caption || '');
        await base44.asServiceRole.entities.MarketingPost.update(post.id, { status: 'published' });
        publishedCount += 1;
      } catch (error) {
        failed.push({ id: post.id, error: error.message });
      }
    }
    return Response.json({ ok: failed.length === 0, published: publishedCount, failed });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}