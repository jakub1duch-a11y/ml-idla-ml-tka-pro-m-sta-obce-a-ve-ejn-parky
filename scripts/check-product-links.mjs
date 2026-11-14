import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PRODUCT_MENU_GROUPS } from '../src/components/layout/productMenuLinks.js';
import { COLLECTIONS } from '../src/components/kolekce/collectionData.js';

// Aktuální veřejné slugs produktu v Base44, ověřeno 14. 11. 2026.
// Při přidání produktu upravit společně s katalogovým menu a otestovat v PR.
const publicProductSlugs = new Set([
  'Linea-ce', 'mlzny-mrak-1413', 'mlzny-mrak-1480', 'mlzny-mrak-2424',
  'mlzny-mrak-1414', 'mlzitko-kvet-4', 'mlzitko-kapr', 'mlzitko-kruh',
  'mlzitko-mrkev', 'teepee', 'bendy-radius-l', 'bendy-radius-m',
  'bendy-radius-s', 'mlzitko-steblo', 'ostrev-city', 'linea-avenue',
  'linea-CE-gate', 'mlzitko-bendy-field', 'bendy-alej',
  'bendy-back-to-back', 'mlzitko-2-stebla', 'mlzitko-volavka',
  'mlzna-brana-steblo', 'mlzici-tryska', 'aura-mlzitko',
  'mlzna-brana-gate', 'mlzitko-bendy', 'y-armist-tr60', 'y-armist-j70',
  'mlzitko-mrak', 'mlzna-spirála', 'linea-mlzitko', 'mlzitko-lizatko'
]);
const errors = [];
const menuProducts = new Set();
for (const group of PRODUCT_MENU_GROUPS) {
  for (const { path, label } of group.links || []) {
    if (!path?.startsWith('/produkt/')) continue;
    const slug = decodeURIComponent(path.slice('/produkt/'.length).split(/[?#]/)[0]);
    if (!publicProductSlugs.has(slug)) errors.push(`Menu: neznámý produkt "${label}" → ${path}`);
    if (menuProducts.has(slug)) errors.push(`Menu: duplicita ${path}`);
    menuProducts.add(slug);
  }
}
for (const slug of publicProductSlugs) {
  if (!menuProducts.has(slug)) errors.push(`V menu chybí produkt: ${slug}`);
}
for (const [category, collection] of Object.entries(COLLECTIONS)) {
  for (const slug of collection.productSlugs || []) {
    if (!publicProductSlugs.has(slug)) errors.push(`Kolekce ${category} odkazuje na neexistující produkt: ${slug}`);
  }
}
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'node_modules') inspect(filename); continue; }
    if (!entry.isFile() || !/\.(js|jsx|json)$/.test(filename)) continue;
    const rel = relative('.', filename).replaceAll('\\', '/');
    if (rel === 'src/App.jsx') continue; // historické slugs se zde záměrně přesměrovávají
    const contents = readFileSync(filename, 'utf8');
    for (const match of contents.matchAll(/['"`]\/produkt\/([^\s'"\x60/?#{}<>]+)/g)) {
      const slug = match[1];
      if (slug.startsWith('$') || slug.startsWith(':')) continue;
      if (!publicProductSlugs.has(slug)) errors.push(`${rel}: odkaz /produkt/${slug} není v aktuální databázi`);
    }
  }
}
inspect('src');
if (errors.length) {
  console.error('Nalezeny chyby produktových odkazů:\n' + [...new Set(errors)].map((s) => '- ' + s).join('\n'));
  process.exit(1);
}
console.log(`MLŽIDLA: OK – ${publicProductSlugs.size} platných produktů, kontrola menu, kolekcí a statických URL prošla.`);
