export const VISUAL_RULE_VERSION = '2026-09-20.1';

export const VISUAL_ENVIRONMENTS = [
  { value: 'namesti', label: 'Městské náměstí', prompt: 'současné české nebo evropské náměstí, kvalitní dlažba, stromy nebo stín, přirozený pohyb lidí, realistická městská architektura' },
  { value: 'mestsky_park', label: 'Městský park', prompt: 'městský park s pěšími trasami, lavičkami, vzrostlou zelení a pobytovou zónou' },
  { value: 'promenada', label: 'Promenáda / pěší zóna', prompt: 'městská promenáda nebo pěší zóna s přirozeným pohybem lidí a kultivovaným mobiliářem' },
  { value: 'event', label: 'Letní event / festival', prompt: 'letní městský event, festival nebo slavnost, dočasná pobytová zóna, přirození návštěvníci, žádná přeplněná reklamní grafika' },
  { value: 'mestska_zahrada', label: 'Městská zahrada / veřejná zeleň', prompt: 'veřejná nebo komunitní městská zahrada, trávník, záhony, stromy, pobytové plochy' },
  { value: 'rezidencni_zahrada', label: 'Rezidenční zahrada', prompt: 'prémiová současná soukromá zahrada u rodinného domu, terasa, kvalitní zeleň, realistické měřítko' },
  { value: 'gastro_terasa', label: 'Gastro / hotelová terasa', prompt: 'moderní hotelová nebo restaurační terasa s přirozenými hosty a kvalitním venkovním mobiliářem' },
  { value: 'sportoviste', label: 'Sportoviště / koupaliště', prompt: 'venkovní sportoviště nebo koupaliště s bezpečnou pěší zónou a letním provozem' },
  { value: 'skola_skolka', label: 'Škola / školka / hřiště', prompt: 'bezpečný venkovní školní nebo školkový areál, hřiště a pobytová plocha, děti pouze jako nenápadné měřítko' },
];

export const CONFIGURATION_PRESETS = [
  { value: 'single', label: 'SINGLE · 1 ks', quantity: 1 },
  { value: 'duo', label: 'DUO · 2 ks', quantity: 2 },
  { value: 'trio', label: 'TRIO · 3 ks', quantity: 3 },
  { value: 'alej', label: 'ALEJ · 5 ks', quantity: 5 },
  { value: 'gate', label: 'BRÁNA · 2 ks proti sobě', quantity: 2 },
];

const COMMON_NEGATIVE = [
  'neměnit počet ramen, trubek, trysek, ohybů ani jejich polohu',
  'nepřidávat nové konstrukční části, dekorace, hadice, kabely ani podpěry',
  'neměnit profil, materiál, patku, kotvení ani základní proporce produktu',
  'nevytvářet mlhu mimo skutečné nebo z reference zřejmé trysky',
  'nepoužívat text, logo ani vodoznak uvnitř generované scény',
];

const familyLock = (product = {}) => {
  const key = `${product.name || ''} ${product.slug || ''}`.toLowerCase();
  if (key.includes('bendy')) return 'BENDY LOCK: jeden identický výrobek tvoří čistý svislý nerezový dřík přecházející do jednoho plynulého horního ohybu přesně podle MASTER fotografie. Žádné větvení, boční trubky, sekundární oblouky, výhonky ani dekorativní konce.';
  if (key.includes('stéblo') || key.includes('steblo')) return 'STÉBLO LOCK: zachovej jednu souvislou organicky zakřivenou nerezovou siluetu přesně podle MASTER reference. Neměň délku, rádius, sklon ani zakončení; nepřidávej větve nebo druhý oblouk.';
  if (key.includes('linea ce') || key.includes('linea-solo')) return 'LINEA CE LOCK: zachovej přesný charakteristický zakřivený C-profil a jeho proporce podle MASTER reference. Žádný další zlom, druhé rameno ani změna směru zakřivení.';
  if (key.includes('linea')) return 'LINEA LOCK: zachovej přesně konkrétní variantu LINEA z MASTER fotografie — čistou vertikální nebo variantně definovanou geometrii. Nemíchej JA, CE, LE, kruhový a hranatý profil.';
  if (key.includes('gate') || key.includes('brána') || key.includes('brana')) return 'GATE LOCK: zachovej přesnou geometrii průchozí brány a oba její boky/oblouky podle MASTER reference. Neměň šířku průchodu, počet nosných prvků ani tvar horní části mimo perspektivní transformaci.';
  if (key.includes('y-armist') || key.includes('ostřev') || key.includes('ostrev')) return 'Y-ARMIST / OSTŘEV LOCK: počet ramen a jejich prostorové rozložení musí přesně odpovídat MASTER fotografii. Nepřidávej ani neubírej ramena a neměň jejich napojení.';
  if (key.includes('teepee')) return 'TEEPEE LOCK: zachovej přesnou sestavu, počet nosných nerezových prvků, jejich sklon, spojení a půdorys podle MASTER fotografie. Nepřidávej další vzpěry ani dekorativní konstrukci.';
  if (key.includes('aura')) return 'AURA LOCK: silueta, oblouk/rádius, výška, zakončení a poloha trysek musí odpovídat MASTER fotografii. Neměň produkt na jinou variantu AURA ani na podobný obloukový výrobek.';
  if (key.includes('mrak')) return 'MRAK LOCK: organická silueta a počet jednotlivých konstrukčních částí musí přesně odpovídat MASTER fotografii. Nevymýšlej jiné kontury mraku ani další smyčky.';
  if (key.includes('spirál') || key.includes('spiral')) return 'SPIRÁLA LOCK: zachovej přesný počet závitů, průměry, rozestupy a průběh spirály podle MASTER fotografie. Nezhušťuj ani neroztahuj závity.';
  if (key.includes('lízát') || key.includes('lizat')) return 'LÍZÁTKO LOCK: zachovej přesný kruhový/halo prvek, jeho průměr, napojení na stojinu a polohu trysek podle MASTER fotografie.';
  if (key.includes('kruh')) return 'KRUH LOCK: zachovej přesný kruhový průchozí tvar, tloušťku profilu, napojení a proporce podle MASTER fotografie.';
  if (key.includes('květ') || key.includes('kvet')) return 'KVĚT LOCK: zachovej přesný počet listů/ramen a jejich symetrii či asymetrii podle MASTER fotografie. Nepřidávej další listy ani neměň jejich napojení.';
  return 'MASTER LOCK: produkt je neměnný objekt. Zachovej přesně jeho siluetu, topologii konstrukce, počet a polohu ramen/trubek/trysek, rádiusy, proporce, materiál, patku a kotvení podle hlavní produktové fotografie.';
};

export function getMasterReference(product = {}) {
  return product.visual_master_reference_url
    || (product.hero_visual_verified && product.hero_product_image_url ? product.hero_product_image_url : '')
    || product.image_url
    || '';
}

export function getProductReferenceImages(product = {}, max = 4) {
  return [
    getMasterReference(product),
    product.image_url,
    product.hero_product_image_url,
    ...(product.gallery_urls || []),
  ].filter(Boolean).filter((url, index, all) => all.indexOf(url) === index).slice(0, max);
}

export function getGeometryLock(product = {}) {
  return product.visual_geometry_lock || familyLock(product);
}

export function getNegativeRules(product = {}) {
  return [...COMMON_NEGATIVE, ...(product.visual_negative_rules || [])].filter((rule, index, all) => all.indexOf(rule) === index);
}

export function getAllowedEnvironmentValues(product = {}) {
  const stored = product.visual_allowed_environments || [];
  return stored.length ? stored : VISUAL_ENVIRONMENTS.map((item) => item.value);
}

export function buildProductVisualizationGuard(product = {}, options = {}) {
  const environment = VISUAL_ENVIRONMENTS.find((item) => item.value === options.environment) || VISUAL_ENVIRONMENTS[0];
  const configuration = CONFIGURATION_PRESETS.find((item) => item.value === options.configuration) || CONFIGURATION_PRESETS[0];
  const quantity = Math.max(1, Number(options.quantity || configuration.quantity || 1));
  const master = getMasterReference(product);
  const verified = Boolean(product.visual_master_verified || product.hero_visual_verified);

  return {
    master,
    verified,
    quantity,
    environment,
    configuration,
    prompt: `PRODUCT MASTER — ABSOLUTNÍ PRIORITA: První produktová reference je MASTER fotografie skutečného výrobku ${product.name || 'MLŽIDLA'}. Produkt nesmí být redesignován. ${getGeometryLock(product)}

KONFIGURACE: ${configuration.label}. Zobraz přesně ${quantity} identických kusů stejného produktu. SINGLE/DUO/TRIO/ALEJ/BRÁNA mění pouze počet kusů, jejich rozmístění a natočení v prostoru; nikdy geometrii jednotlivého kusu.

PROSTŘEDÍ: ${environment.prompt}. Prostředí, lidé, světlo, roční doba, kompozice a úhel kamery se mohou měnit, ale výrobek zůstává geometricky shodný s MASTER referencí.

ZAKÁZÁNO:
- ${getNegativeRules(product).join('\n- ')}

MLHA: jemná, průsvitná a realistická; vychází pouze ze skutečných nebo z MASTER reference jednoznačně zřejmých trysek. Nesmí zakrýt kontrolovatelné konstrukční detaily.

STAV MASTERU: ${verified ? 'ověřený — stále vyžaduje vizuální kontrolu výsledku proti referenci' : 'NEOVĚŘENÝ — výsledek je pouze návrhový koncept a nesmí být automaticky schválen pro klientskou prezentaci'}.`,
  };
}
