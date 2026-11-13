import { isPublicCatalogProduct } from '@/lib/publicCatalogProducts';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();

export const GATE_GROUPS = [
  { id: 'all', label: 'Všechny produkty' },
  { id: 'gate', label: 'Mlžné brány' },
  { id: 'portal', label: 'Vstupní portály' },
  { id: 'arrangement', label: 'Mlžné sestavy' },
  { id: 'standalone', label: 'Samostatné prvky' },
];

// Nezobrazovat zrušené samostatné produkty jako nové modely GATE.
const HIDDEN_GATE_SLUGS = new Set(['steblo-gate', 'linea-gate']);

// Ukázková cena vodného a stočného, nikoli tarif konkrétní obce.
const EXAMPLE_WATER_TARIFF_CZK_M3 = 120;
const formatCzk = (value) => Math.round(value).toLocaleString('cs-CZ');
function estimateWaterCost8h(waterConsumption) {
  const match = String(waterConsumption || '').match(/(\d+(?:[.,]\d+)?)\s*[–-]\s*(\d+(?:[.,]\d+)?)\s*l\/h/i);
  if (!match) return null;
  const low = Number(match[1].replace(',', '.'));
  const high = Number(match[2].replace(',', '.'));
  if (!(low > 0 && high >= low)) return null;
  return `cca ${formatCzk(low * 8 / 1000 * EXAMPLE_WATER_TARIFF_CZK_M3)}–${formatCzk(high * 8 / 1000 * EXAMPLE_WATER_TARIFF_CZK_M3)} Kč`;
}

const PRESENTATION = {
  'linea-CE-gate': { group: 'gate', caption: 'Mlžná brána ze dvou zakřivených sloupů', text: 'Dva stejné sloupy LINEA CE 70 stojí proti sobě. Každý má pět trysek; rozteč průchodu se přizpůsobí místu.' },
  'brana-bendy': { group: 'gate', caption: 'Průchozí brána ze dvou prvků BENDY', text: 'Dvě mlžítka BENDY proti sobě vytvářejí průchozí mlžnou zónu pro parky, promenády a veřejné prostory.' },
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
  return records.filter(isPublicCatalogProduct).filter((product) => !HIDDEN_GATE_SLUGS.has(product.slug)).flatMap((product) => {
    if (seen.has(product.slug)) return [];
    seen.add(product.slug);

    if (product.slug === 'mlzna-brana-gate' && Array.isArray(product.variants) && product.variants.length) {
      return product.variants.map((variant, index) => ({
        id: `${product.slug}-variant-${index}`,
        name: variant.name,
        group: 'gate',
        caption: [variant.profile, variant.dimensions ? `Š × V: ${variant.dimensions} mm` : null].filter(Boolean).join(' · ') || 'Provedení mlžné brány',
        image: variant.image_url || product.image_url,
        imageAlt: `${variant.name} – náhled příslušné tvarové a rozměrové varianty`,
        text: variant.description || 'Rozměry a profil podle vybraného provedení. Konfiguraci potvrdíme podle projektu.',
        constructionNote: /^BRÁNA GATE 60_(2115|2130)$/i.test(variant.name || '')
          ? 'Horní rohy jsou rádiusově ohýbané na průběžném dílu trubky, nikoli sestavené z ostrých svařovaných kolen.'
          : null,
        technical: [
          { label: 'Profil', value: variant.profile },
          { label: 'Rozměr Š × V', value: variant.dimensions ? `${variant.dimensions} mm` : null },
          { label: 'Trysky', value: variant.nozzles ? `${variant.nozzles} ks` : null },
          { label: 'Tlak systému', value: product.pressure },
        ].filter((item) => item.value),
        waterNote: product.water_consumption ? `Spotřeba celé řady: ${product.water_consumption}; skutečná spotřeba závisí na tryskách a tlaku konkrétní varianty.` : null,
        waterCost8h: estimateWaterCost8h(product.water_consumption),
        waterCostNote: 'Model pro celou řadu při ukázkové sazbě 120 Kč/m³, nikoli garantovaná spotřeba vybrané varianty.',
        detailUrl: `/produkt/${encodeURIComponent(product.slug)}?varianta=${encodeURIComponent(variant.name)}`,
        quoteUrl: `/poptavka?produkt=${encodeURIComponent(product.slug)}&varianta=${encodeURIComponent(variant.name)}`,
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
      imageAlt: `${product.name} – produktové provedení`,
      text: configured?.text || product.short_description || 'Nerezové mlžení s konfigurací podle konkrétního prostoru.',
      technical: [
        { label: 'Materiál', value: product.material },
        { label: 'Tlak systému', value: product.pressure },
      ].filter((item) => item.value),
      detailUrl: `/produkt/${encodeURIComponent(product.slug)}`,
      quoteUrl: `/poptavka?produkt=${encodeURIComponent(product.name)}`,
    }];
  }).sort((a, b) => {
    const order = ['gate', 'portal', 'arrangement', 'standalone'];
    return order.indexOf(a.group) - order.indexOf(b.group) || a.name.localeCompare(b.name, 'cs');
  });
}
