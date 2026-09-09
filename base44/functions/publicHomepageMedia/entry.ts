import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const MEDIA = {
  real_installation: { id: '1cSPAcblhokLZArxpZp36063k5asVhpl5', mime: 'image/jpeg' },
  mounting_detail: { id: '1__eVqpBwzMX0loBdkofhB8V7gbOIW_59', mime: 'image/jpeg' },
  garden: { id: '1oDlzInG48Dh5aA1JqC_rIRG03BFIIwMw', mime: 'image/jpeg' },
  playground: { id: '1tP-3RazWz0-wVjuKOmQp6-rdlSuERqHq', mime: 'image/jpeg' },
  architecture: { id: '1YtWNydSV7gmdTGxOqj1SfyF-a8hkH33Y', mime: 'image/jpeg' },
  festival: { id: '1_u5W74I5tCFDz3g08G7Xds119RvhcmOy', mime: 'image/jpeg' },
  video: { id: '1G8-hVwel0l1RJQNa9qI6FzEWuKQ6IRH_', mime: 'video/mp4' },
};

function toBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  }
  return btoa(binary);
}

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const key = String(body.key || '');
    const item = MEDIA[key];
    if (!item) return Response.json({ error: 'Unknown media key' }, { status: 404 });

    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    let sourceUrl = `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media&supportsAllDrives=true`;
    if (item.mime.startsWith('image/')) {
      const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${item.id}?fields=thumbnailLink&supportsAllDrives=true`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        if (meta.thumbnailLink) sourceUrl = String(meta.thumbnailLink).replace(/=s\d+$/, '=s1600');
      }
    }

    const source = await fetch(sourceUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!source.ok) return Response.json({ error: `Media fetch failed: ${source.status}` }, { status: 502 });
    const bytes = new Uint8Array(await source.arrayBuffer());
    return Response.json({ key, mime: item.mime, data_url: `data:${item.mime};base64,${toBase64(bytes)}` }, {
      headers: { 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Media unavailable' }, { status: 500 });
  }
});
