import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_URL = 'https://mlzidla.cz';

const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/mlzidla-mlzitka', priority: '0.9', changefreq: 'weekly' },
  { loc: '/mestske-mlzitka', priority: '0.9', changefreq: 'weekly' },
  { loc: '/zahradni-mlzitka', priority: '0.85', changefreq: 'weekly' },
  { loc: '/zakazkova-mlzitka', priority: '0.85', changefreq: 'monthly' },
  { loc: '/jak-to-funguje', priority: '0.7', changefreq: 'monthly' },
  { loc: '/smart-ovladani', priority: '0.75', changefreq: 'monthly' },
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

const LOCALIZED_STATIC_PATHS = [
  '/en', '/en/misting-systems', '/en/urban-misting', '/en/garden-misting', '/en/custom-misting', '/en/how-it-works', '/en/smart-control', '/en/projects', '/en/contact', '/en/quote', '/en/about', '/en/faq',
  '/de', '/de/nebelanlagen', '/de/stadtnebel', '/de/gartennebel', '/de/sonderanfertigung', '/de/funktionsweise', '/de/smart-steuerung', '/de/referenzen', '/de/kontakt', '/de/anfrage', '/de/ueber-uns', '/de/faq',
  '/pl', '/pl/systemy-mglowe', '/pl/systemy-mglowe-dla-miast', '/pl/mgla-wodna-do-ogrodu', '/pl/systemy-mglowe-na-zamowienie', '/pl/jak-dziala-mgla-wodna', '/pl/inteligentne-sterowanie', '/pl/realizacje', '/pl/kontakt', '/pl/wycena', '/pl/o-nas', '/pl/faq',
  '/sk', '/sk/hmlove-systemy', '/sk/hmlove-systemy-pre-mesta', '/sk/hmlove-systemy-do-zahrady', '/sk/hmlove-systemy-na-mieru', '/sk/ako-funguje-vodna-hmla', '/sk/smart-riadenie', '/sk/realizacie', '/sk/kontakt', '/sk/cenova-ponuka', '/sk/o-nas', '/sk/faq',
  '/it', '/it/sistemi-nebulizzazione', '/it/nebulizzazione-urbana', '/it/nebulizzazione-giardino', '/it/nebulizzazione-su-misura', '/it/come-funziona', '/it/controllo-smart', '/it/progetti', '/it/contatti', '/it/preventivo', '/it/chi-siamo', '/it/faq',
];

const LOCALIZED_STATIC_PAGES = LOCALIZED_STATIC_PATHS.map((loc) => ({
  loc,
  priority: loc.split('/').filter(Boolean).length === 1 ? '0.9' : '0.75',
  changefreq: 'monthly',
}));

const HREFLANG_GROUPS = [
  { 'cs-CZ': '/', en: '/en', 'de-DE': '/de', 'pl-PL': '/pl', 'sk-SK': '/sk', 'it-IT': '/it', 'x-default': '/' },
  { 'cs-CZ': '/mlzidla-mlzitka', en: '/en/misting-systems', 'de-DE': '/de/nebelanlagen', 'pl-PL': '/pl/systemy-mglowe', 'sk-SK': '/sk/hmlove-systemy', 'it-IT': '/it/sistemi-nebulizzazione', 'x-default': '/mlzidla-mlzitka' },
  { 'cs-CZ': '/mestske-mlzitka', en: '/en/urban-misting', 'de-DE': '/de/stadtnebel', 'pl-PL': '/pl/systemy-mglowe-dla-miast', 'sk-SK': '/sk/hmlove-systemy-pre-mesta', 'it-IT': '/it/nebulizzazione-urbana', 'x-default': '/mestske-mlzitka' },
  { 'cs-CZ': '/zahradni-mlzitka', en: '/en/garden-misting', 'de-DE': '/de/gartennebel', 'pl-PL': '/pl/mgla-wodna-do-ogrodu', 'sk-SK': '/sk/hmlove-systemy-do-zahrady', 'it-IT': '/it/nebulizzazione-giardino', 'x-default': '/zahradni-mlzitka' },
  { 'cs-CZ': '/zakazkova-mlzitka', en: '/en/custom-misting', 'de-DE': '/de/sonderanfertigung', 'pl-PL': '/pl/systemy-mglowe-na-zamowienie', 'sk-SK': '/sk/hmlove-systemy-na-mieru', 'it-IT': '/it/nebulizzazione-su-misura', 'x-default': '/zakazkova-mlzitka' },
  { 'cs-CZ': '/jak-to-funguje', en: '/en/how-it-works', 'de-DE': '/de/funktionsweise', 'pl-PL': '/pl/jak-dziala-mgla-wodna', 'sk-SK': '/sk/ako-funguje-vodna-hmla', 'it-IT': '/it/come-funziona', 'x-default': '/jak-to-funguje' },
  { 'cs-CZ': '/smart-ovladani', en: '/en/smart-control', 'de-DE': '/de/smart-steuerung', 'pl-PL': '/pl/inteligentne-sterowanie', 'sk-SK': '/sk/smart-riadenie', 'it-IT': '/it/controllo-smart', 'x-default': '/smart-ovladani' },
  { 'cs-CZ': '/reference', en: '/en/projects', 'de-DE': '/de/referenzen', 'pl-PL': '/pl/realizacje', 'sk-SK': '/sk/realizacie', 'it-IT': '/it/progetti', 'x-default': '/reference' },
  { 'cs-CZ': '/kontakt', en: '/en/contact', 'de-DE': '/de/kontakt', 'pl-PL': '/pl/kontakt', 'sk-SK': '/sk/kontakt', 'it-IT': '/it/contatti', 'x-default': '/kontakt' },
  { 'cs-CZ': '/poptavka', en: '/en/quote', 'de-DE': '/de/anfrage', 'pl-PL': '/pl/wycena', 'sk-SK': '/sk/cenova-ponuka', 'it-IT': '/it/preventivo', 'x-default': '/poptavka' },
  { 'cs-CZ': '/o-nas', en: '/en/about', 'de-DE': '/de/ueber-uns', 'pl-PL': '/pl/o-nas', 'sk-SK': '/sk/o-nas', 'it-IT': '/it/chi-siamo', 'x-default': '/o-nas' },
  { 'cs-CZ': '/podpora', en: '/en/faq', 'de-DE': '/de/faq', 'pl-PL': '/pl/faq', 'sk-SK': '/sk/faq', 'it-IT': '/it/faq', 'x-default': '/podpora' },
];

function alternatesFor(loc) {
  const group = HREFLANG_GROUPS.find((item) => Object.values(item).includes(loc));
  return group ? Object.entries(group).map(([hreflang, path]) => ({ hreflang, path })) : [];
}

function toW3CDate(d) {
  return new Date(d).toISOString().split('T')[0];
}

function buildUrl(loc, lastmod, priority, changefreq, alternates = []) {
  const alternateXml = alternates.map(({ hreflang, path }) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}${path}" />`).join('\n');
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
${alternateXml ? `${alternateXml}\n` : ''}    <changefreq>${changefreq}</changefreq>
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
    for (const page of [...STATIC_PAGES, ...LOCALIZED_STATIC_PAGES]) {
      urls.push(buildUrl(page.loc, today, page.priority, page.changefreq, alternatesFor(page.loc)));
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
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
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