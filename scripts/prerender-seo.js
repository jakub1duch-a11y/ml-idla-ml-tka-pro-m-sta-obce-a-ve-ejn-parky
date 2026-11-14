// Post-build step: generates a static index.html per route with the correct
// <title>, meta description/keywords, canonical link and Open Graph / Twitter
// tags baked directly into the HTML (not set via client-side JS).
//
// Why: this app is a client-rendered SPA. Before this script ran, every route
// was served the exact same generic index.html — meaning social link
// previews (Facebook, LinkedIn, WhatsApp, Slack, X) and any crawler that
// doesn't execute JS always saw the homepage's title/description/image,
// regardless of which page was actually shared or crawled.
//
// This script writes dist/<route>/index.html for every static page defined
// in SEO_PAGES, with its own baked-in metadata. Static hosts serve an exact
// file match (dist/kontakt/index.html for a request to /kontakt) before
// falling back to the SPA's catch-all index.html, so this works without any
// server-side routing changes.
//
// Published product routes use a metadata snapshot so direct links work on
// static hosts without a SPA rewrite. Product data is still loaded live by
// the application. Blog and reference detail routes need separate snapshots.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_PAGES } from '../src/lib/seo.js';
import { LOCALIZED_SEO_PAGES } from '../src/lib/localized-content.js';
import { LOCALE_CONFIG, getLanguageAlternates, getRouteKeyFromPath } from '../src/lib/i18n.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const BASE_URL = 'https://mlzidla.cz';
const SITE_NAME = 'MLŽIDLA.cz';
const DEFAULT_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.jpg';

// Legacy and alias routes must not fall through to the generic SPA document.
// Base44 does not expose per-path HTTP 301 rules in the app configuration, so
// we emit exact static redirect documents with noindex + canonical + instant
// meta/JS redirect. Static route files take precedence over the SPA fallback.
const LEGACY_REDIRECTS = {
  '/produkt/linea-solo': '/produkt/Linea-ce',
  '/produkt/linea-ce': '/produkt/Linea-ce',
  '/mlziste': '/mlhoviste',
  '/domu': '/',
  '/hello-world': '/',
  '/category/uncategorized': '/blog',
  '/product-category/vodni-mlzitka': '/mlzidla-mlzitka',
  '/mlzici-brany': '/mlzne-brany',
  '/terms-privacy': '/gdpr',
  '/faq': '/podpora',
  '/technologie': '/jak-to-funguje',
  '/chytra-mlzidla': '/smart-ovladani',
  '/manualy': '/ke-stazeni',
  '/kolekce/city': '/mestske-mlzitka',
  '/kolekce/garden': '/zahradni-mlzitka',
  '/kolekce/art': '/zakazkova-mlzitka',
  '/mlzidla': '/mlzidla-mlzitka',
};

const productPages = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'lib', 'product-page-meta.json'), 'utf-8'));

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

function escapeAttr(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function renderPage(page) {
  const fullTitle = `${page.title} | ${SITE_NAME}`;
  const locale = page.locale || 'cs';
  const localeConfig = LOCALE_CONFIG[locale] || LOCALE_CONFIG.cs;
  const imagePath = page.image || DEFAULT_IMAGE;
  const img = imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
  const url = `${BASE_URL}${page.canonicalPath}`;
  let html = template;

  html = html.replace(/<html lang=".*?">/s, `<html lang="${localeConfig.htmlLang}">`);
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeAttr(fullTitle)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeAttr(page.description)}" />`);
  if (page.keywords) {
    html = html.replace(/<meta name="keywords" content=".*?" \/>/s, `<meta name="keywords" content="${escapeAttr(page.keywords)}" />`);
  }
  html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeAttr(fullTitle)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${escapeAttr(page.description)}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${img}" />`);
  html = html.replace(/<meta property="og:locale" content=".*?" \/>/s, `<meta property="og:locale" content="${localeConfig.ogLocale}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${img}" />`);

  const routeKey = getRouteKeyFromPath(page.canonicalPath);
  const alternates = page.alternates || (routeKey ? getLanguageAlternates(routeKey) : []);
  const alternateTags = alternates.map(({ hreflang, path }) => `    <link rel="alternate" hreflang="${escapeAttr(hreflang)}" href="${BASE_URL}${escapeAttr(path)}" />`).join('\n');
  if (alternateTags) html = html.replace('</head>', `${alternateTags}\n  </head>`);

  // Include verified route-specific JSON-LD in the HTML response so crawlers
  // can parse it without executing JavaScript. Client SEO updates this ID.
  if (page.jsonLd) {
    const structuredData = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `    <script type="application/ld+json" id="json-ld-seo">${structuredData}</script>\n  </head>`);
  }

  // Make the main contact and inquiry copy readable in the initial HTML.
  // React replaces this static content when the interactive page mounts.
  const staticContent = {
    '/kontakt': '<main aria-label="Kontakt MLŽIDLA.cz"><h1>Kontakt na výrobce mlžítek a mlžných bran</h1><p>HolmTec v Trutnově připravuje nerezová městská mlžítka, mlhoviště, zahradní mlžítka a mlžné brány pro náměstí, parky, školy, terasy a soukromé zahrady. Konzultujeme rozměry prostoru, přívod vody, umístění, ovládání a servis.</p><p>Telefon: +420 774 700 390. E-mail: obchod1@holmtec.cz.</p></main>',
    '/poptavka': '<main aria-label="Poptávka MLŽIDLA.cz"><h1>Nezávazná poptávka mlžítka, mlhoviště nebo mlžné brány</h1><p>Navrhujeme nerezová městská a zahradní mlžítka, mlhoviště, sestavy mlžítek a průchozí mlžné brány pro obce, parky, školy, veřejná prostranství a zahrady.</p><p>Pro poptávku připravte místo instalace, přibližné rozměry a informace o dostupnosti vody. Podle konkrétního zadání navrhneme technické řešení, řízení provozu a cenu.</p></main>',
    '/mlhoviste': '<main aria-label="Mlžiště a mlhoviště"><h1>Mlžiště a mlhoviště: venkovní mlžítka pro ochlazení prostoru</h1><p>Mlžiště neboli mlhoviště tvoří jedno nebo více mlžítek, která vytvářejí jemnou vodní mlhu. MLŽIDLA navrhujeme pro náměstí, parky, školy, promenády a další veřejné plochy. Počet mlžítek, rozestupy, přívod vody a způsob řízení závisí na místě instalace.</p><h2>Jak navrhnout mlžiště</h2><p>Pro návrh mlhoviště posuzujeme velikost plochy, pohyb návštěvníků, dostupný tlak a průtok vody, směr větru, kotvení a servisní přístup. Nízkotlaké varianty mohou pracovat bez vysokotlakého čerpadla.</p><p><a href="/poptavka">Poptat mlžiště nebo mlhoviště</a></p></main>',
    '/mlzitka-pro-sportoviste': '<main><h1>Mlžítka pro sportoviště a venkovní sportovní areály</h1><p>Nerezová mlžítka pro venkovní sportoviště, běžecké areály a odpočinkové zóny. Navrhujeme umístění mimo kolizní trasy, přívod vody, provozní režim a údržbu.</p><p><a href="/poptavka">Poptat mlžítko pro sportoviště</a></p></main>',
    '/mlzitka-mestsky-mobiliar': '<main><h1>Mlžítka jako součást městského mobiliáře</h1><p>Designová nerezová mlžítka, mlžné brány a mlžné prvky pro náměstí, parky a promenády. Řešíme tvar, kotvení, vodu a návaznost na veřejný prostor.</p><p><a href="/poptavka">Poptat městský mlžný prvek</a></p></main>',
    '/mestske-mlzitka': '<main aria-label="Městská kolekce mlžítek"><h1>Městská mlžítka pro náměstí, parky a obce</h1><p>Nerezová městská mlžítka MLŽIDLA jsou určena pro návrhy venkovního ochlazování ve veřejném prostoru. Samostatné mlžítko, mlžná brána nebo sestava mlžítek může doplnit park, náměstí, pěší zónu či školní areál.</p><h2>Výběr městského mlžítka</h2><p>Pro městská mlžítka řešíme rozměry, umístění, napojení vody, kotvení, provozní cykly a případné chytré řízení. Konkrétní variantu a technické parametry ověřujeme podle projektu.</p><p><a href="/poptavka">Poptat městská mlžítka</a></p></main>',
    '/rezidencni-mlzeni': '<main aria-label="Zahradní kolekce mlžítek"><h1>Zahradní mlžítka a mlžítko na terasu</h1><p>Zahradní kolekce MLŽIDLA zahrnuje nerezová mlžítka pro soukromé zahrady, terasy, pergoly a venkovní odpočinkové zóny. Zahradní mlžítko vytváří jemnou vodní mlhu a může být součástí výsadby nebo zahradní architektury.</p><h2>Jak vybrat zahradní mlžítko</h2><p>Při návrhu řešíme velikost terasy či zahrady, umístění mlžítka, dostupnost vody, vhodný provozní režim a volitelné ovládání. Výběr konkrétního modelu přizpůsobíme prostoru.</p><p><a href="/poptavka">Poptat zahradní mlžítko</a></p></main>',
    '/zakazkova-mlzitka': '<main aria-label="Zakázková mlžítka"><h1>Zakázková mlžítka a mlžné sochy na míru</h1><p>Zakázková mlžítka MLŽIDLA vznikají podle požadavků konkrétního místa. Navrhujeme nerezové mlžítko, mlžnou sochu nebo sestavu mlžítek pro města, parky, školy, zahrady a architektonické instalace.</p><h2>Návrh mlžítka na míru</h2><p>Z fotografie, skici nebo půdorysu připravíme návrh tvaru a umístění. Před výrobou ověřujeme geometrii, materiál, kotvení, vodní připojení a možnosti údržby.</p><p><a href="/poptavka">Poptat zakázkové mlžítko</a></p></main>',
    '/pronajem': '<main aria-label="Pronájem mlžítek GO"><h1>Pronájem mobilních mlžítek MLŽIDLA GO</h1><p>Mobilní mlžítka a mlžné brány GO lze poptat pro festivaly, firemní akce, sportovní události a letní programy. Pronájem mlžítka zahrnuje návrh vhodného počtu a rozmístění podle místa, termínu a provozních podmínek.</p><h2>Mlžítko na akci: co připravit</h2><p>Pro pronájem mlžítek potřebujeme znát datum akce, místo instalace, předpokládaný počet návštěvníků a dostupnost vody. Podle konkrétního prostoru posoudíme stabilitu mobilní sestavy, vedení hadic a technické zajištění.</p><p><a href="/poptavka">Poptat pronájem mlžítek</a></p></main>',
  }[page.canonicalPath];
  if (staticContent) html = html.replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);

  return html;
}

let count = 0;
const pagesToRender = [...Object.values(SEO_PAGES), ...LOCALIZED_SEO_PAGES, ...productPages.filter(page => /^\/produkt\/[\p{L}\p{N}-]+$/u.test(page.canonicalPath))];
for (const page of pagesToRender) {
  if (!page.canonicalPath) continue;

  const html = renderPage(page);

  if (page.canonicalPath === '/') {
    // Overwrite the root index.html so the homepage itself also gets its
    // (already-correct, but now baked-in) tags.
    writeFileSync(join(distDir, 'index.html'), html);
  } else {
    const outDir = join(distDir, page.canonicalPath.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
  }
  count++;
}

let redirectCount = 0;
for (const [fromPath, toPath] of Object.entries(LEGACY_REDIRECTS)) {
  const targetUrl = `${BASE_URL}${toPath === '/' ? '/' : toPath}`;
  const outDir = join(distDir, fromPath.replace(/^\//, ''));
  mkdirSync(outDir, { recursive: true });
  const redirectHtml = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${escapeAttr(targetUrl)}" />
    <meta http-equiv="refresh" content="0;url=${escapeAttr(targetUrl)}" />
    <title>Přesměrování | ${SITE_NAME}</title>
    <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
  </head>
  <body>
    <p>Tato adresa byla přesunuta. <a href="${escapeAttr(targetUrl)}">Pokračovat na MLŽIDLA.cz</a>.</p>
  </body>
</html>`;
  writeFileSync(join(outDir, 'index.html'), redirectHtml);
  redirectCount++;
}

// Keep the sitemap in sync with all statically rendered canonical pages (including products/locales).
// Merge the curated sitemap from public/ so established category/reference URLs are preserved.
const sitemapPath = join(distDir, 'sitemap.xml');
const existingSitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf-8') : '';
const existingUrls = [...existingSitemap.matchAll(/<loc>\s*(https:\/\/mlzidla\.cz[^<]*)\s*<\/loc>/g)].map((match) => {
  try { return new URL(match[1]).pathname; } catch { return null; }
}).filter(Boolean);
const excludedRedirectPaths = new Set(Object.keys(LEGACY_REDIRECTS).map((path) => path.replace(/\/+$/, '') || '/'));
const canonicalPaths = new Set([
  ...existingUrls,
  ...pagesToRender.map((page) => page.canonicalPath).filter(Boolean),
]);
for (const path of excludedRedirectPaths) canonicalPaths.delete(path);
const sitemapEntries = [...canonicalPaths]
  .filter((path) => path.startsWith('/') && !path.includes('?') && !path.includes('#'))
  .map((path) => {
    const loc = new URL(path, BASE_URL).href;
    const priority = path === '/' ? '1.0' : path.startsWith('/produkt/') ? '0.8' : '0.7';
    return `  <url><loc>${loc.replace(/&/g, '&amp;')}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  })
  .join('\n');
writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`);

console.log(`[prerender-seo] wrote ${count} pre-rendered SEO page(s), ${redirectCount} legacy redirect document(s), and ${canonicalPaths.size} sitemap URL(s).`);

