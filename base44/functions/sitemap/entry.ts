import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const BASE_URL = 'https://mlzidla.cz';
const staticPages = [
  ['/', '1.0', 'weekly'], ['/mlzidla-mlzitka', '0.9', 'weekly'], ['/katalog', '0.9', 'weekly'], ['/jak-funguje-mlzeni', '0.8', 'monthly'], ['/chytra-mlzidla', '0.8', 'monthly'], ['/smart-ovladani', '0.7', 'monthly'], ['/prinosy-mlzitek', '0.8', 'monthly'], ['/vyuziti', '0.8', 'monthly'], ['/zahradni-mlzitka', '0.9', 'weekly'], ['/reference', '0.8', 'weekly'], ['/blog', '0.8', 'weekly'], ['/podpora', '0.7', 'monthly'], ['/poradce', '0.7', 'monthly'], ['/kalkulacka', '0.7', 'monthly'], ['/kontakt', '0.7', 'monthly'], ['/o-nas', '0.6', 'monthly'], ['/partnerstvi', '0.6', 'monthly'], ['/udrzitelnost', '0.6', 'monthly'], ['/ke-stazeni', '0.5', 'monthly'], ['/servis-udrzba', '0.6', 'monthly'], ['/videosekce-mlzitka', '0.5', 'monthly'], ['/certifikace', '0.5', 'monthly'], ['/prislusenstvi', '0.7', 'monthly'], ['/galerie', '0.7', 'weekly'], ['/gate70', '0.7', 'monthly'], ['/poptavka', '0.7', 'monthly'], ['/obchodni-podminky', '0.2', 'yearly'], ['/gdpr', '0.2', 'yearly'],
  ['/vyuziti/mesta-obce', '0.8', 'monthly'], ['/vyuziti/parky-hriste', '0.8', 'monthly'], ['/vyuziti/skoly-skolky-deti', '0.7', 'monthly'], ['/vyuziti/domovy-senioru', '0.7', 'monthly'], ['/vyuziti/hotely', '0.7', 'monthly'], ['/vyuziti/wellness-terasy', '0.7', 'monthly'], ['/vyuziti/koupaliste', '0.7', 'monthly'], ['/vyuziti/architekti', '0.7', 'monthly'], ['/vyuziti/komercni', '0.7', 'monthly'], ['/vyuziti/eventy', '0.7', 'monthly'], ['/vyuziti/outdoor-zahrady', '0.8', 'monthly'], ['/vyuziti/art-instalace', '0.6', 'monthly'],
  ['/reseni/designova', '0.7', 'monthly'], ['/reseni/brany', '0.8', 'monthly'], ['/reseni/chytre-moduly', '0.7', 'monthly'], ['/reseni/mobilni-eventove', '0.7', 'monthly'], ['/prinosy-mlzitek/zvyseni-trzeb-a-prodeje', '0.7', 'monthly'], ['/prinosy-mlzitek/automatizace-provozu', '0.7', 'monthly'], ['/prinosy-mlzitek/zabezpeceni-a-shoda', '0.6', 'monthly'], ['/prinosy-mlzitek/snizovani-provoznich-nakladu', '0.7', 'monthly'],
];

const date = (value) => new Date(value || Date.now()).toISOString().split('T')[0];
const escapeXml = (value) => String(value).replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]);
const url = (path, lastmod, priority, changefreq) => `  <url><loc>${BASE_URL}${escapeXml(path)}</loc><lastmod>${date(lastmod)}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const [products, posts, references, customPages] = await Promise.all([
      base44.asServiceRole.entities.Product.list(),
      base44.asServiceRole.entities.BlogPost.filter({ published: true }),
      base44.asServiceRole.entities.Realizace.filter({ published: true }),
      base44.asServiceRole.entities.CustomPage.filter({ published: true }),
    ]);
    const entries = staticPages.map(([path, priority, frequency]) => url(path, Date.now(), priority, frequency));
    products.filter((item) => item.slug).forEach((item) => entries.push(url(`/produkt/${item.slug}`, item.updated_date || item.created_date, '0.8', 'weekly')));
    posts.filter((item) => item.slug).forEach((item) => entries.push(url(`/blog/${item.slug}`, item.updated_date || item.published_date || item.created_date, '0.7', 'monthly')));
    references.forEach((item) => entries.push(url(`/reference/${item.id}`, item.updated_date || item.created_date, '0.7', 'monthly')));
    customPages.filter((item) => item.slug).forEach((item) => entries.push(url(`/p/${item.slug}`, item.updated_date || item.created_date, '0.5', 'monthly')));
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});