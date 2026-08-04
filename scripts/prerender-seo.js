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

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const BASE_URL = 'https://mlzidla.cz';
const SITE_NAME = 'Mlžidla.cz - MLŽIDLA® / Mlžítka HolmTec';
const DEFAULT_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.jpg';

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

function escapeAttr(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function renderPage(page) {
  const fullTitle = `${page.title} | ${SITE_NAME}`;
  const img = page.image || DEFAULT_IMAGE;
  const url = `${BASE_URL}${page.canonicalPath}`;
  let html = template;

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
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${img}" />`);

  return html;
}

let count = 0;
for (const key of Object.keys(SEO_PAGES)) {
  const page = SEO_PAGES[key];
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

console.log(`[prerender-seo] wrote ${count} pre-rendered HTML file(s) with route-specific meta tags.`);
