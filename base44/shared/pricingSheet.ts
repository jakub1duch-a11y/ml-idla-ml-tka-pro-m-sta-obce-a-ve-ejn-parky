export const PRICING_SPREADSHEET_ID = '1krevQXk1GnSDjT3f5bDCL2nPjgb_u9-_D2YXwIBBhjI';
export const PRICING_SHEET_NAME = 'Kalkulace 2026';
export const PRICING_RANGE = `'${PRICING_SHEET_NAME}'!A8:AJ220`;

const clean = (value: unknown) => String(value || '').replace(/\s+/g, ' ').trim();
const normalize = (value: unknown) => clean(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .replace(/®/g, '')
  .replace(/[^A-Z0-9]+/g, ' ')
  .trim();

const parseMoney = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/Kč/gi, '')
    .replace(/[^0-9,.-]/g, '')
    .replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
};

const PRODUCT_ALIASES: Record<string, string[]> = {
  'MLZITKO-BENDY': ['BENDY_60'],
  'BENDY-SINGLE': ['BENDY_60'],
  'BENDY-ARC': ['BENDY_76'],
  'BRANA-BENDY': ['BENDY_76'],
  'AURA-MLZITKO': ['AURA_700'],
  'AURA-GARDEN-SINGLE': ['AURA_700'],
  'AURA-CITY-SINGLE': ['AURA_900'],
  'MLZITKO-LIZATKO': ['LÍZÁTKO'],
  'MLZITKO-MRAK': ['MRAK'],
  'MLZNA-SPIRALA': ['SPIRÁLA'],
  'OSTREV-MLZITKO': ['OSTEV'],
  'OSTREV-CITY-S': ['OSTEV'],
  'OSTREV-CITY-M': ['OSTEV'],
  'OSTREV-CITY-L': ['OSTEV'],
  'Y-ARMIST-TR60': ['Y-ARMIST TR60'],
  'Y-ARMIST-J70': ['Y-ARMIST JA70'],
  'LINEA-SOLO': ['LINEA CE70'],
  'LINEA-MLZITKO': ['LINEA CE70'],
  'LINEA-GATE': ['BRÁNA RADIUS'],
  'MLZNA-BRANA-GATE': ['BRÁNA 300 RADIUS', 'BRÁNA RADIUS'],
  'CITY-ARC-1': ['BRÁNA RADIUS'],
  'CITY-ARC-2': ['BRÁNA 300 RADIUS'],
};

const slugKey = (slug: unknown) => normalize(String(slug || '').replace(/_/g, '-')).replace(/ /g, '-');

const rankAliases = (product: any, inquiryText = '') => {
  const productText = normalize(`${product?.name || ''} ${product?.slug || ''}`);
  const inquiry = normalize(inquiryText);
  const slug = slugKey(product?.slug);
  const aliases = [...(PRODUCT_ALIASES[slug] || [])];

  if (/BENDY/.test(productText)) {
    if (/\b76\b/.test(inquiry) || /CITY|MEST/.test(productText)) aliases.unshift('BENDY_76');
    else aliases.unshift('BENDY_60');
  }
  if (/AURA/.test(productText)) {
    if (/\b900\b/.test(inquiry) || /CITY|MEST/.test(productText)) aliases.unshift('AURA_900');
    else aliases.unshift('AURA_700');
  }
  if (/MRAK/.test(productText)) aliases.unshift('MRAK');
  if (/LIZATKO/.test(productText)) aliases.unshift('LÍZÁTKO');
  if (/SPIRALA/.test(productText)) aliases.unshift('SPIRÁLA');
  if (/OSTREV/.test(productText)) aliases.unshift('OSTEV');
  if (/Y ARMIST/.test(productText) && /TR60|TUBE/.test(productText)) aliases.unshift('Y-ARMIST TR60');
  if (/Y ARMIST/.test(productText) && /J70|4HRAN/.test(productText)) aliases.unshift('Y-ARMIST JA70');

  return aliases.map(normalize).filter((item, index, all) => item && all.indexOf(item) === index);
};

export type PricingResult = {
  matched: boolean;
  sheet_key: string;
  sheet_spec: string;
  offer_price_ex_vat: number;
  vat_amount: number;
  total_inc_vat: number;
  source: string;
  note?: string;
};

export async function findPricingForProduct(base44: any, product: any, inquiryText = ''): Promise<PricingResult> {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const range = encodeURIComponent(PRICING_RANGE);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${PRICING_SPREADSHEET_ID}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error(`Google Sheets ${response.status}: ${await response.text()}`);
    const payload = await response.json();
    const rows: any[][] = Array.isArray(payload?.values) ? payload.values : [];
    const entries: any[] = [];

    for (let i = 0; i < rows.length - 1; i += 1) {
      const row = rows[i] || [];
      const next = rows[i + 1] || [];
      const key = clean(row[0]);
      if (!key || normalize(next[4]) !== 'CENA ZA POL') continue;
      entries.push({
        key,
        normalizedKey: normalize(key),
        spec: clean(row[2]),
        offerPriceExVat: parseMoney(next[31]), // AF — Nabídková cena bez DPH
        vatAmount: parseMoney(next[32]),      // AG — DPH
        totalIncVat: parseMoney(next[33]),    // AH — CELKEM vč. DPH
      });
    }

    const aliases = rankAliases(product, inquiryText);
    let candidates = entries.filter((entry) => aliases.includes(entry.normalizedKey));

    if (!candidates.length) {
      const productName = normalize(product?.name);
      candidates = entries.filter((entry) => productName && (productName.includes(entry.normalizedKey) || entry.normalizedKey.includes(productName)));
    }

    if (candidates.length > 1 && /MRAK/.test(normalize(product?.name))) {
      const wantsTall = /2500|2[,. ]?5\s*M|H\s*2500/.test(normalize(inquiryText));
      const wanted = candidates.find((entry) => wantsTall ? /2500/.test(entry.spec) : /1600/.test(entry.spec));
      if (wanted) candidates = [wanted];
    }

    const chosen = candidates.find((entry) => entry.offerPriceExVat > 0) || candidates[0];
    if (!chosen || !(chosen.offerPriceExVat > 0)) {
      return {
        matched: false,
        sheet_key: chosen?.key || '',
        sheet_spec: chosen?.spec || '',
        offer_price_ex_vat: 0,
        vat_amount: 0,
        total_inc_vat: 0,
        source: `Google Sheets: Mlžítko / ${PRICING_SHEET_NAME}`,
        note: chosen ? 'Řádek byl nalezen, ale nabídková cena bez DPH není vyplněná.' : 'Pro produkt nebyl nalezen jednoznačný řádek ceníku.',
      };
    }

    return {
      matched: true,
      sheet_key: chosen.key,
      sheet_spec: chosen.spec,
      offer_price_ex_vat: chosen.offerPriceExVat,
      vat_amount: chosen.vatAmount,
      total_inc_vat: chosen.totalIncVat,
      source: `Google Sheets: Mlžítko / ${PRICING_SHEET_NAME} / ${chosen.key}`,
    };
  } catch (error) {
    return {
      matched: false,
      sheet_key: '',
      sheet_spec: '',
      offer_price_ex_vat: 0,
      vat_amount: 0,
      total_inc_vat: 0,
      source: `Google Sheets: Mlžítko / ${PRICING_SHEET_NAME}`,
      note: error?.message || String(error),
    };
  }
}

export type SmartControlPricing = {
  source: string;
  component_wifi_valve_ex_vat: number;
  component_water_meter_ex_vat: number;
  component_row02_ex_vat: number;
  component_liw01_ex_vat: number;
  component_thw01_ex_vat: number;
  complete_supla_ex_vat: number;
  complete_supla_inc_vat: number;
  margin_percent: number;
};

export async function findSmartControlPricing(base44: any): Promise<SmartControlPricing> {
  const fallback: SmartControlPricing = {
    source: 'Google Sheets: Mlžítko / Chytré ovládání SUPLA',
    component_wifi_valve_ex_vat: 0,
    component_water_meter_ex_vat: 0,
    component_row02_ex_vat: 0,
    component_liw01_ex_vat: 0,
    component_thw01_ex_vat: 0,
    complete_supla_ex_vat: 0,
    complete_supla_inc_vat: 0,
    margin_percent: 0,
  };
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const smartRange = encodeURIComponent(`'Chytré ovládání SUPLA'!A9:H60`);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${PRICING_SPREADSHEET_ID}/values/${smartRange}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error(`Google Sheets ${response.status}: ${await response.text()}`);
    const payload = await response.json();
    const rows: any[][] = Array.isArray(payload?.values) ? payload.values : [];
    const findPrice = (name: string) => {
      const row = rows.find((r) => normalize(r?.[2]) === normalize(name));
      return parseMoney(row?.[5]);
    };
    const totalRow = rows.find((r) => normalize(r?.[3]) === 'CENA BEZ DPH');
    const vatTotalRow = rows.find((r) => normalize(r?.[3]) === 'CELKEM S DPH');
    const marginRow = rows.find((r) => normalize(r?.[3]) === 'MARZE');
    return {
      source: fallback.source,
      component_wifi_valve_ex_vat: findPrice('Chytrý ventil PEVEKO'),
      component_water_meter_ex_vat: findPrice('Elektronický vodoměr'),
      component_row02_ex_vat: findPrice('SUPLA ROW-02'),
      component_liw01_ex_vat: findPrice('SUPLA LIW-01'),
      component_thw01_ex_vat: findPrice('SUPLA THW-01'),
      complete_supla_ex_vat: parseMoney(totalRow?.[5]),
      complete_supla_inc_vat: parseMoney(vatTotalRow?.[5]),
      margin_percent: parseMoney(marginRow?.[5]),
    };
  } catch (_) {
    return fallback;
  }
}

export function validatedCatalogFallback(product: any) {
  const value = Number(product?.price_from || 0);
  // Hodnoty 0/1 Kč v katalogu jsou placeholdery, ne obchodní cena.
  return value >= 1000 ? value : 0;
}
