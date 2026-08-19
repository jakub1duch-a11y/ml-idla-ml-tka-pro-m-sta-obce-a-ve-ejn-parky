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
// NOTE: this currently only covers static routes (SEO_PAGES). Dynamic routes
// (/produkt/:slug, /blog/:slug, /reference/:id) need DB access at build time
// and are a follow-up.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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

  return html;
}

let count = 0;
const pagesToRender = [...Object.values(SEO_PAGES), ...LOCALIZED_SEO_PAGES];
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

console.log(`[prerender-seo] wrote ${count} pre-rendered SEO page(s) and ${redirectCount} legacy redirect document(s).`);
