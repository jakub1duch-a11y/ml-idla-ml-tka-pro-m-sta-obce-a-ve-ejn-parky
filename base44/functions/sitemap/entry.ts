import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_URL = 'https://www.mlzidla.cz';

const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/kolekce', priority: '0.9', changefreq: 'weekly' },
  { loc: '/mlhoviste', priority: '0.8', changefreq: 'monthly' },
  { loc: '/jak-to-funguje', priority: '0.7', changefreq: 'monthly' },
  { loc: '/o-nas', priority: '0.7', changefreq: 'monthly' },
  { loc: '/reference', priority: '0.8', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'daily' },
  { loc: '/poptavka', priority: '0.9', changefreq: 'monthly' },
  { loc: '/kontakt', priority: '0.8', changefreq: 'monthly' },
  { loc: '/podpora', priority: '0.6', changefreq: 'monthly' },
  { loc: '/kategorie/mesta-obce', priority: '0.7', changefreq: 'monthly' },
  { loc: '/kategorie/parky-hriste', priority: '0.7', changefreq: 'monthly' },
  { loc: '/kategorie/koupaliste', priority: '0.7', changefreq: 'monthly' },
  { loc: '/kategorie/architekti', priority: '0.7', changefreq: 'monthly' },
  { loc: '/kategorie/komercni', priority: '0.7', changefreq: 'monthly' },
  { loc: '/kategorie/eventy', priority: '0.7', changefreq: 'monthly' },
  { loc: '/gdpr', priority: '0.3', changefreq: 'yearly' },
];

function toW3CDate(d) {
  return new Date(d).toISOString().split('T')[0];
}

function buildUrl(loc, lastmod, priority, changefreq) {
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const [products, blogPosts, references] = await Promise.all([
      base44.asServiceRole.entities.Product.list().catch(() => []),
      base44.asServiceRole.entities.BlogPost.filter({ published: true }).catch(() => []),
      base44.asServiceRole.entities.Realizace.filter({ published: true }).catch(() => []),
    ]);

    const today = toW3CDate(new Date());
    const urls = [];

    // Static pages
    for (const page of STATIC_PAGES) {
      urls.push(buildUrl(page.loc, today, page.priority, page.changefreq));
    }

    // Product pages
    for (const p of products) {
      if (p.slug) {
        const lastmod = toW3CDate(p.updated_date || p.created_date || new Date());
        urls.push(buildUrl(`/produkt/${p.slug}`, lastmod, '0.85', 'weekly'));
      }
    }

    // Blog posts
    for (const post of blogPosts) {
      if (post.slug) {
        const lastmod = toW3CDate(post.updated_date || post.published_date || post.created_date || new Date());
        urls.push(buildUrl(`/blog/${post.slug}`, lastmod, '0.65', 'monthly'));
      }
    }

    // Reference detail pages
    for (const ref of references) {
      if (ref.id) {
        const lastmod = toW3CDate(ref.updated_date || ref.created_date || new Date());
        urls.push(buildUrl(`/reference/${ref.id}`, lastmod, '0.6', 'monthly'));
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;

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