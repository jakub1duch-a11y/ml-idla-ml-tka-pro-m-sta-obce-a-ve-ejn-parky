import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { getInstagramIdentity } from '../../shared/instagram.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const account = await getInstagramIdentity(accessToken);
    const response = await fetch(`https://graph.instagram.com/${account.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${encodeURIComponent(accessToken)}`);
    const data = await response.json();
    if (!response.ok) return Response.json({ error: data?.error?.message || 'Instagram feed se nepodařilo načíst.' }, { status: response.status });
    const posts = (data.data || []).map((post) => ({ instagram_id: post.id, caption: post.caption || '', media_type: post.media_type, media_url: post.media_url, thumbnail_url: post.thumbnail_url || '', permalink: post.permalink, posted_at: post.timestamp }));
    const existing = await base44.asServiceRole.entities.InstagramPost.list();
    const byInstagramId = new Map(existing.map((item) => [item.instagram_id, item]));
    for (const post of posts) {
      const match = byInstagramId.get(post.instagram_id);
      if (match) await base44.asServiceRole.entities.InstagramPost.update(match.id, post);
      else await base44.asServiceRole.entities.InstagramPost.create(post);
    }
    return Response.json({ username: account.username, posts, connection: 'shared' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}