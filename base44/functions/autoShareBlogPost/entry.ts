import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { publishInstagramImage } from '../../shared/instagram.ts';

const BASE_URL = 'https://mlzidla.cz';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { event, data } = await req.json().catch(() => ({}));
    if (!event || event.entity_name !== 'BlogPost') return Response.json({ ok: false, reason: 'Not a BlogPost event' });
    const postId = String(event.entity_id || data?.id || '').trim();
    if (!postId) return Response.json({ ok: false, reason: 'Missing BlogPost ID' }, { status: 400 });
    const post = await base44.asServiceRole.entities.BlogPost.get(postId);
    if (!post || !post.published || post.instagram_posted) return Response.json({ ok: false, reason: 'Post not published or already shared' });
    if (!post.image_url) return Response.json({ ok: false, reason: 'Post has no image' });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const link = `${BASE_URL}/blog/${post.slug || post.id}`;
    const caption = `${post.title}\n\n${post.perex || ''}\n\nCelý příběh a řešení: ${link}\nNezávazná konzultace: ${BASE_URL}/poptavka\n\n#mlzidla #ochlazenimesta #mestskaarchitektura #nerezovamlzitka #smartcities`;
    const published = await publishInstagramImage(accessToken, post.image_url, caption);
    await base44.asServiceRole.entities.BlogPost.update(post.id, { instagram_posted: true });
    return Response.json({ ok: true, media_id: published.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}