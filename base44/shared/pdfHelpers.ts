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