// Sdílené helpery pro PDF generování nabídek a projektových balíčků MLŽIDLA.cz
// Extrahováno z generateOfferConceptPdf a generateProjectPackage pro eliminaci duplikací

export const clean = (value: unknown, max = 2000) => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

export const stripDiacritics = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Převod textu pro PDF (default helvetica nepodporuje českou diakritiku)
export const pt = (value: unknown) => stripDiacritics(clean(value)).replace(/[^\x20-\x7E]/g, '');

export const toBase64 = (bytes: Uint8Array) => {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

export async function fetchImageAsBase64(url: string, timeoutMs = 12000): Promise<{ data: string; format: string } | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) return null;
    const blob = await response.blob();
    const buffer = new Uint8Array(await blob.arrayBuffer());
    const base64 = toBase64(buffer);
    const format = blob.type.includes('png') ? 'PNG' : 'JPEG';
    return { data: base64, format };
  } catch {
    return null;
  }
}

export function buildReference(id: string): string {
  if (!id) return '';
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
  } catch { return ''; }
}

// Brand barvy sjednocené s customerEmails.ts (schválený aktuální design)
export const PDF_COLORS = {
  INK: '#0d2d38',
  CYAN: '#2bbfcf',
  CYAN_DARK: '#0e7584',
  TEXT_MUTED: '#60777d',
  TEXT_BODY: '#50666c',
  PANEL_BG: '#f5f8f8',
  PANEL_BORDER: '#e1e9ea',
  LINE: '#dfe7e7',
};

// Labely pro instalaci — sjednocené s dispatchInquiryConfirmation
export const INSTALLATION_LABELS: Record<string, string> = {
  full_excavation: 'Kompletní výkop a instalace',
  prepared_water: 'Připravený přívod vody',
  temporary_manhole: 'Dočasný šachtový prostor',
  product_only: 'Pouze produkt (bez instalace)',
  unsure: 'Ještě nevím',
};

export const WATER_LABELS: Record<string, string> = {
  unknown: 'Neznámý stav',
  ready_at_location: 'Připraven na místě',
  in_manhole: 'V šachtě',
  requires_route: 'Vyžaduje novou trasu',
};

export const SURFACE_LABELS: Record<string, string> = {
  unknown: 'Neznámý',
  paving: 'Dlažba',
  asphalt: 'Asfalt',
  concrete: 'Beton',
  grass: 'Tráva / trávník',
  gravel: 'Štěrk',
  other: 'Jiný',
};

export const SUPLA_VERIFIED_FEATURES = [
  'Mobilni zapnuti/vypnuti mlzeni odkudkoli pri dostupnem internetu',
  'Casove plany a tydenni scenare chodu mlzeni',
  'Lokalni rucni rizeni ventilu pri vypadku spojeni',
];

export const SUPLA_CONDITIONAL_FEATURES = [
  'Automatizace podle teploty (pouze s prislusnym cidlem)',
  'Automatizace podle pohybu (pouze s PIR senzorem)',
  'Monitoring prutoku vody (pouze s elektronickym vodomerem)',
  'Samostatne zony (pouze s prislusnym poctem kanalu/ventilu)',
];

export const SUPLA_NOT_SUPPORTED = [
  'Hlasovi asistenti nejsou garantovanou funkci',
  'Platforma Tuya neni soucasti overene konfigurace',
  'Toto neni vzdalene rizeni webove aplikace MLZIDLA.cz',
];

export const SUPLA_TECH_PREREQUISITES = [
  'Dostupnost a pokryti Wi-Fi v miste ridici jednotky',
  'Dostupny internet pro cloudovou komunikaci',
  'Zabezpeceni site (WPA2/WPA3)',
  'Napajeni ridici jednotky (230 V nebo 24 V dle typu)',
  'Kompatibilni ridici jednotka SUPLA (ROW-02 nebo ekvivalent)',
  'Kompatibilni ventil nebo zonove rozvadace',
  'Kryti a umisteni ridici elektroniky v prostredi (IP54+ pro venkovni pouziti)',
  'Chovani pri vypadku spojeni - lokalni rucni rizeni dle overeneho hardware',
];

export const SUPLA_NETWORK_NOTE = 'Frekvence 2,4 GHz pouze pokud konkretni zarizeni vyzaduje dle overeneho datasheetu; jinak standardni Wi-Fi.';

export const SITUATIONAL_PLAN_DISCLAIMER = 'Tento koncepni situacni plan je navrhem umisteni, nikoli technickym projektem. Kruhy mlznych zon jsou ilustrační bez overenych vypoctu. Meritko pouze s podklady. Umisteni a instalace podlehaji finalnimu technickemu odsouhlaseni. Doporuceni reflektuje pohyb lidi, povrch, servisni pristup a bezpecnost; nezasahuje do overenych inzenyrskych siti.';

export const SITUATIONAL_PLAN_ITEMS = [
  'Doporucene umisteni produktu s ohledem na pohyb osob a bezpecnost',
  'Navrzena trasa privodu vody (tyrkysova cara)',
  'Umisteni ridici jednotky a ventilu (pri smart modulu)',
  'Kotveni a upevneni dle typu povrchu',
  'Servisni pristup pro udrzbu a zimni provoz',
  'Ilustracni kruhy mlznych zony (bez overenych vypoctu)',
];

export function buildChecklist(inquiry: any, order: any, products: any[], variants: any[], hasAllPrices: boolean, smartIncluded: boolean) {
  const confirmed: string[] = [];
  const remaining: string[] = [];

  if (inquiry?.jmeno) confirmed.push('Kontaktni udaje klienta');
  if (inquiry?.email) confirmed.push('E-mail klienta');
  if (inquiry?.produkt || products.length) confirmed.push('Vyber produktu');
  if (inquiry?.installation_location) confirmed.push('Lokalita instalace');
  if (inquiry?.surface_type && inquiry.surface_type !== 'unknown') confirmed.push('Typ povrchu');
  if (inquiry?.water_connection_state && inquiry.water_connection_state !== 'unknown') confirmed.push('Stav privodu vody');
  if (inquiry?.installation_option && inquiry.installation_option !== 'unsure') confirmed.push('Rozsah instalace');
  if (products.length) confirmed.push('Produktove listy s parametry');
  if (variants.length) confirmed.push('Obchodni varianty');
  if (hasAllPrices && variants.length > 0) confirmed.push('Ceny z aktualniho ceniku');
  if (order?.total_price && order.total_price > 0) confirmed.push('Celkova cena nabidky');

  if (!inquiry?.installation_location) remaining.push('Presna lokalita instalace');
  if (!inquiry?.surface_type || inquiry.surface_type === 'unknown') remaining.push('Typ povrchu v miste instalace');
  if (!inquiry?.water_connection_state || inquiry.water_connection_state === 'unknown') remaining.push('Stav privodu vody');
  if (!inquiry?.installation_option || inquiry.installation_option === 'unsure') remaining.push('Rozsah instalace (vykop / bez instalace)');
  if (!hasAllPrices) remaining.push('Finalni ceny z aktualniho ceniku');
  if (!variants.length) remaining.push('Obchodni varianty s cenami');
  if (!products.length) remaining.push('Vyber konkretniho produktu');
  remaining.push('Technicka proveditelnost a kotveni');
  remaining.push('Termin dodani a instalace');
  if (smartIncluded) {
    remaining.push('Overeni pokryti Wi-Fi v miste ridici jednotky');
    remaining.push('Overeni napajeni pro ridici jednotku');
    remaining.push('Potvrzeni kompatibilniho ventilu a kanalu');
  }

  return { confirmed, remaining };
}

export function buildProductReasons(products: any[], inquiry: any): string[] {
  const reasons: string[] = [];
  if (products.length === 0) return reasons;

  const productNames = products.map(p => p.name).filter(Boolean).join(', ');
  if (productNames) reasons.push('Vybrany produkt: ' + productNames);

  const materials = [...new Set(products.map(p => p.material).filter(Boolean))];
  if (materials.length) reasons.push('Material: ' + materials.join(', '));

  const micronSizes = [...new Set(products.map(p => p.micron_size).filter(Boolean))];
  if (micronSizes.length) reasons.push('Velikost kapek: ' + micronSizes.join(', '));

  const coverage = products.map(p => p.coverage_area).filter(Boolean);
  if (coverage.length) reasons.push('Orientacni pokryti: ' + coverage.join(', '));

  if (inquiry?.surface_type && inquiry.surface_type !== 'unknown') {
    reasons.push('Povrch v miste instalace: ' + (SURFACE_LABELS[inquiry.surface_type] || inquiry.surface_type));
  }

  if (inquiry?.water_connection_state && inquiry.water_connection_state !== 'unknown') {
    reasons.push('Privod vody: ' + (WATER_LABELS[inquiry.water_connection_state] || inquiry.water_connection_state));
  }

  reasons.push('Kotveni a upevneni dle typu povrchu a lokality');
  reasons.push('Servisni pristup pro udrzbu a zimni provoz');

  return reasons;
}