import { isPublicCatalogProduct } from '@/lib/publicCatalogProducts';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const GATE_GROUPS = [
  { id: 'all', label: 'Všechny produkty' },
  { id: 'gate', label: 'Brány GATE' },
  { id: 'portal', label: 'Vstupní portály' },
  { id: 'standalone', label: 'Samostojící mlžítka' },
];

const PRESENTATION = {
  'mlzna-brana-gate': [
    { variant: 'U', name: 'GATE70-U', group: 'gate', caption: 'Pravoúhlá mlžná brána', image: '/media/gates/gate-u.webp', text: 'Čistá pravoúhlá linie pro vstupy do areálů, náměstí a moderní veřejný prostor.' },
    { variant: 'V', name: 'GATE70-V', group: 'gate', caption: 'Mlžná brána s lomeným obloukem', image: '/media/gates/gate-v.webp', text: 'Jemně lomený oblouk vytváří průchod mlhou na promenádách, v parcích a pobytových zónách.' },
  ],
  'linea-gate': [{ name: 'LINEA CE GATE®', group: 'portal', caption: 'Vstupní portál ze dvou linií', image: '/media/gates/linea-gate.webp', text: 'Dvojice zakřivených nerezových prvků vymezuje otevřenou cestu jemnou mlhou.' }],
  'mlzitko-kruh': [{ name: 'KRUH', group: 'portal', caption: 'Kruhový mlžný portál', image: '/media/gates/kruh.webp', text: 'Výrazný kruhový průchod pro parky, promenády a předprostory veřejných budov.' }],
  'teepee': [{ name: 'TEEPEE', group: 'standalone', caption: 'Samostojící mlžítko', image: '/media/gates/teepee.webp', text: 'Samostojící konstrukce pro slavnosti a sezónní mlžné zóny. Napojení vody a bezpečné umístění řešíme podle místa.' }],
};

// Expand the documented GATE variants; other cards come only from public Product records.
export function buildGateCatalog(records = []) {
  const seen = new Set();
  return records.filter(isPublicCatalogProduct).flatMap((product) => {
    if (seen.has(product.slug)) return [];
    seen.add(product.slug);
    const name = normalize(product.name);
    const slug = normalize(product.slug);
    const group = /gate|brana/.test(`${slug} ${name}`) ? 'gate' : /portal/.test(`${slug} ${name}`) ? 'portal' : null;
    const presentations = PRESENTATION[product.slug] || (group ? [{ name: product.name, group, caption: group === 'gate' ? 'Mlžná brána' : 'Vstupní portál', image: product.image_url, text: product.short_description || 'Nerezové mlžení s konfigurací podle konkrétního prostoru.' }] : []);
    return presentations.map((view) => ({
      ...view,
      id: `${product.slug}${view.variant ? `-${view.variant}` : ''}`,
      slug: product.slug,
      detailUrl: view.variant ? `/gate70?varianta=${view.variant}` : `/produkt/${encodeURIComponent(product.slug)}`,
      quoteUrl: `/poptavka?produkt=${encodeURIComponent(view.name)}`,
    }));
  }).sort((a, b) => {
    const order = ['gate', 'portal', 'standalone'];
    return order.indexOf(a.group) - order.indexOf(b.group) || a.name.localeCompare(b.name, 'cs');
  });
}
