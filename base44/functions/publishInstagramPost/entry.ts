import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { publishInstagramImage } from '../../shared/instagram.ts';

export default async function(req) {
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
    if (post.status === 'published') return Response.json({ success: true, alreadyPublished: true });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const published = await publishInstagramImage(accessToken, post.image_url, post.caption || '');
    await base44.asServiceRole.entities.MarketingPost.update(postId, { status: 'published' });
    return Response.json({ success: true, media_id: published.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}