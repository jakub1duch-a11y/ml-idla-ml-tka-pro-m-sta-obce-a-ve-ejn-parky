import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { publishInstagramImage } from '../../shared/instagram.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { realizaceId, caption, imageUrl } = await req.json();
    if (!realizaceId) return Response.json({ error: 'Chybí ID realizace' }, { status: 400 });

    const realizace = await base44.asServiceRole.entities.Realizace.get(realizaceId);
    if (!realizace) return Response.json({ error: 'Realizace nenalezena' }, { status: 404 });

    const photo = imageUrl || realizace.image_url || (realizace.gallery_urls || [])[0];
    if (!photo) return Response.json({ error: 'Realizace nemá fotografii k publikaci' }, { status: 400 });

    const text = (caption || '').trim() || [
      realizace.name,
      realizace.location ? `📍 ${realizace.location}` : '',
      realizace.description || '',
      '#mlzidla #mlzitka #chlazeni #verejnyprostor',
    ].filter(Boolean).join('\n\n');

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    const published = await publishInstagramImage(accessToken, photo, text);

    return Response.json({ success: true, media_id: published.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}