import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_URL = 'https://mlzidla.cz';
const BRAND = 'HolmTec';

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const products = await base44.asServiceRole.entities.Product.list().catch(() => []);

    const items = products.filter((p) => p.slug).map((p) => {
      const link = `${BASE_URL}/produkt/${p.slug}`;
      const image = p.image_url || (p.gallery_urls && p.gallery_urls[0]) || '';
      const price = p.price_from ? `${p.price_from} CZK` : '';
      return `  <item>
    <g:id>${esc(p.id)}</g:id>
    <title>${esc(p.name)}</title>
    <description>${esc(p.short_description || p.description || p.name)}</description>
    <link>${esc(link)}</link>
    ${image ? `<g:image_link>${esc(image)}</g:image_link>` : ''}
    <g:availability>in stock</g:availability>
    <g:condition>new</g:condition>
    <g:brand>${BRAND}</g:brand>
    ${price ? `<g:price>${esc(price)}</g:price>` : ''}
  </item>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>HolmTec — Mlžítka a mlžné sochy</title>
  <link>${BASE_URL}</link>
  <description>Produktový feed pro Google Merchant Center</description>
${items.join('\n')}
</channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});