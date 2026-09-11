// ZÁVAZNÝ STANDARD OBCHODNÍ NABÍDKY MLŽIDLA® — plná B2G struktura (13 sekcí).
// Každá nabídka (PDF, prezentace, e-mail, AI agent) musí dodržet toto pořadí i názvy sekcí.

export const OFFER_STANDARD_KEY = 'b2g_full_13';
export const OFFER_STANDARD_VERSION = '1.0';
export const OFFER_VALIDITY_DAYS = 30;
export const VAT_RATE = 0.21;

export const SUPPLIER = {
  name: 'HolmTec s.r.o. — MLŽIDLA.cz',
  contact: 'Ing. Radek Meduna',
  phone: '+420 774 700 390',
  email: 'meduna@holmtec.cz',
  web: 'www.mlzidla.cz'
};

// key = klíč dat v payloadu, label = nadpis sekce v dokumentu.
export const OFFER_SECTIONS = [
  { key: 'introduction', label: 'Představení a shrnutí zadání', required: true, type: 'text' },
  { key: 'zoning', label: 'Odborné zonování prostoru', required: true, type: 'zones' },
  { key: 'solution', label: 'Doporučené řešení', required: true, type: 'text' },
  { key: 'product', label: 'Vhodný produkt', required: true, type: 'text' },
  { key: 'technical', label: 'Technický popis', required: true, type: 'rows' },
  { key: 'variants', label: 'Návrh a cenová nabídka dle požadavku', required: true, type: 'variants' },
  { key: 'priceSummary', label: 'Shrnutí ceny', required: true, type: 'summary' },
  { key: 'productionPrice', label: 'Orientační cena výroby mlžítek', required: false, type: 'text' },
  { key: 'smartControl', label: 'Chytré řízení', required: false, type: 'text' },
  { key: 'delivery', label: 'Doprava a odzkoušení', required: false, type: 'text' },
  { key: 'service', label: 'Servis a údržba', required: false, type: 'text' },
  { key: 'visualizations', label: 'Vizualizační náhledy a fotografie', required: false, type: 'images' },
  { key: 'nextStep', label: 'Platnost a další krok', required: true, type: 'text' }
];

export const MISSING_DATA_LABEL = 'K technickému ověření';
export const MANUAL_PRICE_LABEL = 'K individuálnímu nacenění';

export const formatCzk = (value) =>
  typeof value === 'number' ? `${new Intl.NumberFormat('cs-CZ').format(Math.round(value))} Kč` : MANUAL_PRICE_LABEL;

export const computeTotals = (variants = []) => {
  const recommended = variants.find((variant) => variant.recommended) || variants[0] || null;
  const base = recommended && typeof recommended.total_price === 'number' ? recommended.total_price : null;
  if (base === null) return { base: null, vat: null, withVat: null, recommended };
  return { base, vat: base * VAT_RATE, withVat: base * (1 + VAT_RATE), recommended };
};

export const validUntil = (from = new Date()) => {
  const date = new Date(from);
  date.setDate(date.getDate() + OFFER_VALIDITY_DAYS);
  return date;
};

// Vrátí seznam chybějících povinných sekcí — kontrola před odesláním nabídky.
export const missingRequiredSections = (content = {}) =>
  OFFER_SECTIONS.filter((section) => section.required && !hasContent(content[section.key])).map((section) => section.label);

const hasContent = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
};