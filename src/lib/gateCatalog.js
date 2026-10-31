import { isPublicCatalogProduct } from '@/lib/publicCatalogProducts';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();

export const GATE_GROUPS = [
  { id: 'all', label: 'Všechny produkty' },
  { id: 'gate', label: 'Mlžné brány' },
  { id: 'portal', label: 'Vstupní portály' },
  { id: 'arrangement', label: 'Mlžné sestavy' },
  { id: 'standalone', label: 'Samostatné prvky' },
];

const PRESENTATION = {
  'linea-CE-gate': { group: 'gate', caption: 'Mlžná brána ze dvou zakřivených sloupů', text: 'Dva stejné sloupy LINEA CE 70 stojí proti sobě. Každý má pět trysek; rozteč průchodu se přizpůsobí místu.' },
  'brana-bendy': { group: 'gate', caption: 'Průchozí brána ze dvou prvků STÉBLO', text: 'Dvě stejná mlžítka STÉBLO proti sobě vytvářejí průchod jemnou mlhou pro parky, promenády a veřejné prostory.' },
  'mlzna-brana-gate': { group: 'gate', caption: 'Rozměrové a tvarové varianty BRÁNA GATE', text: 'Pět doložených provedení s různou výškou, šířkou a profilem. Vyberte konkrétní variantu a zjistěte cenu.' },
  'bendy-alej': { group: 'arrangement', caption: 'Opakované prvky podél pěší trasy', text: 'STÉBLO ALEJ® skládá opakované prvky STÉBLO do mlžné trasy. Počet prvků a rozteče se volí podle délky a využití prostoru.' },
  'bendy-back-to-back': { group: 'arrangement', caption: 'Dvojice prvků umístěných zády k sobě', text: 'STÉBLO BACK-TO-BACK vytváří symetrickou sestavu ze dvou prvků STÉBLO pro parkové uzly a pobytové zóny.' },
  'mlzitko-2-stebla': { group: 'arrangement', caption: 'Dvě stébla pro otevřenou zónu', text: 'Dva stejné prvky STÉBLO tvoří otevřenou sestavu. Rozteč a orientace se upravují podle charakteru místa.' },
  'mlzitko-kruh': { group: 'portal', caption: 'Kruhový mlžný portál', text: 'Výrazný kruhový průchod pro parky, promenády a předprostory veřejných budov.' },
  'teepee': { group: 'standalone', caption: 'Samostatně stojící mlžítko', text: 'Samostojící konstrukce pro slavnosti a sezónní mlžné zóny. Napojení vody a bezpečné umístění řešíme podle místa.' },
};

// Public products are sourced from Product records. BRÁNA GATE expands into its five documented variants.
export function buildGateCatalog(records = []) {
  const seen = new Set();
  return records.filter(isPublicCatalogProduct).flatMap((product) => {
    if (seen.has(product.slug)) return [];
    seen.add(product.slug);

    if (product.slug === 'mlzna-brana-gate' && Array.isArray(product.variants) && product.variants.length) {
      return product.variants.map((variant, index) => ({
        id: `${product.slug}-variant-${index}`,
        name: variant.name,
        group: 'gate',
        caption: [variant.profile, variant.dimensions ? `${variant.dimensions} mm` : null].filter(Boolean).join(' · ') || 'Provedení mlžné brány',
        image: variant.image_url || product.image_url,
        text: variant.description || 'Rozměry a profil podle vybraného provedení. Přesnou konfiguraci potvrzujeme v nabídce.',
        detailUrl: `/produkt/${encodeURIComponent(product.slug)}?varianta=${encodeURIComponent(variant.name)}`,
        quoteUrl: `/poptavka?produkt=${encodeURIComponent(variant.name)}`,
      }));
    }

    const name = normalize(product.name);
    const slug = normalize(product.slug);
    const configured = PRESENTATION[product.slug];
    const inferredGroup = /gate|brana/.test(`${slug} ${name}`) ? 'gate' : /portal|kruh/.test(`${slug} ${name}`) ? 'portal' : null;
    const group = configured?.group || inferredGroup;
    if (!group) return [];

    return [{
      id: product.slug,
      name: product.name,
      group,
      caption: configured?.caption || (group === 'gate' ? 'Mlžná brána' : 'Vstupní portál'),
      image: product.image_url,
      text: configured?.text || product.short_description || 'Nerezové mlžení s konfigurací podle konkrétního prostoru.',
      detailUrl: `/produkt/${encodeURIComponent(product.slug)}`,
      quoteUrl: `/poptavka?produkt=${encodeURIComponent(product.name)}`,
    }];
  }).sort((a, b) => {
    const order = ['gate', 'portal', 'arrangement', 'standalone'];
    return order.indexOf(a.group) - order.indexOf(b.group) || a.name.localeCompare(b.name, 'cs');
  });
}
