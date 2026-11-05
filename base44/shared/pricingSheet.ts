export const PRICING_SPREADSHEET_ID = '1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8';
export const PRICING_SHEET_NAME = '📋 Kusovník';
export const PRICING_RANGE = `'${PRICING_SHEET_NAME}'!A1:AK3`;
export const PRICING_SOURCE_URL = `https://docs.google.com/spreadsheets/d/${PRICING_SPREADSHEET_ID}/edit`;

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
  offer_price_// Jediný zdroj prodejních cen produktů je aktuální řádek 2 listu „📋 Kusovník“.
// Položky bez ceny nelze automaticky nacenit; nikdy nepřebírat Product.price_from.
export async function findPricingForProduct(base44: any, product: any, inquiryText = ''): Promise<PricingResult> {
  const source = `Google Sheets: Kalkulace mlžítka 2026 / ${PRICING_SHEET_NAME}`;
  const noMatch = (note: string): PricingResult => ({
    matched: false, sheet_key: '', sheet_spec: '', offer_price_ex_vat: 0,
    vat_amount: 0, total_inc_vat: 0, source, note,
  });

  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    if (!accessToken) return noMatch('Google Sheets není připojen; cena musí být ověřena ručně.');
    const range = encodeURIComponent(PRICING_RANGE);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${PRICING_SPREADSHEET_ID}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) throw new Error(`Google Sheets ${response.status}: ${await response.text()}`);
    const payload = await response.json();
    const rows: unknown[][] = Array.isArray(payload?.values) ? payload.values : [];
    const [names = [], prices = [], catalogFlags = []] = rows;
    if (!names?.length || normalize(names[0]) !== 'PRODUKT' || normalize(prices[0]) !== 'AKTUALNI CENA KS') {
      return noMatch('Neočekávané záhlaví aktuálního kusovníku. Automatické nacenění zastaveno.');
    }
    const entries = names.slice(1).map((name, idx) => ({
      key: clean(name), normalizedKey: normalize(name), price: parseMoney(prices[idx + 1]),
      catalog: String(catalogFlags[idx + 1] || '').trim() === '1',
    })).filter(entry => entry.key);
    const productName = normalize(product?.name);
    const slug = slugKey(product?.slug);
    const context = normalize(`${product?.name || ''} ${inquiryText}`);
    let target = entries.find(entry => entry.normalizedKey === productName);

    if (!target) {
      const knownAliases: Record<string, string> = {
        'MLZITKO-BENDY': 'BENDY_60',
        'BENDY-SINGLE': 'BENDY_60',
        'BENDY-ARC': 'BENDY_76',
        'AURA-MLZITKO': 'AURA 700',
        'AURA-GARDEN-SINGLE': 'AURA 700',
        'AURA-CITY-SINGLE': 'AURA 900',
        'MLZITKO-LIZATKO': 'LÍZÁTKO',
        'MLZNA-SPIRALA': 'SPIRÁLA',
        'OSTREV-MLZITKO': 'OSTREV',
        'OSTREV-CITY-S': 'OSTREV',
        'OSTREV-CITY-M': 'OSTREV',
        'OSTREV-CITY-L': 'OSTREV',
        'Y-ARMIST-TR60': 'Y-ARMIST TR60',
        'Y-ARMIST-J70': 'Y-ARMIST HR70',
        'LINEA-SOLO': 'LINEA Ce 70',
      };
      let key = knownAliases[slug] || '';
      if (/MRAK/.test(context)) {
        key = /\b1414\b|\b10R\b/.test(context) ? 'MRAK 10R 1414'
          : /\b2424\b|\b13R\b/.test(context) ? 'MRAK 13R 2424' : '';
      } else if (/LINEA/.test(context)) {
        key = /\bCE\s*70\b/.test(context) ? 'LINEA Ce 70'
          : /\bLE\s*70\b/.test(context) ? 'LINEA Le 70'
          : /\bJA\s*70\b/.test(context) ? 'LINEA JA 70'
          : /\bTR\s*50\b/.test(context) ? 'LINEA TR 50'
          : /\bTR\s*60\b/.test(context) ? 'LINEA TR 60'
          : /\bTR\s*76\b/.test(context) ? 'LINEA TR 76' : key;
      } else if (/BRANA/.test(context)) {
        key = /76/.test(context) && /2130/.test(context) ? 'BRÁNA 76_2130'
          : /2115/.test(context) ? 'BRÁNA 60_2115'
          : /2130/.test(context) ? 'BRÁNA 60_2130' : '';
      } else if (/VOLAVKA/.test(context)) {
        key = /GRACILIS/.test(context) ? 'VOLAVKA Gracilis'
          : /GIGANTEA/.test(context) ? 'VOLAVKA Gigantea' : '';
      } else if (/TEEPEE/.test(context)) {
        key = /\b50\b/.test(context) ? 'TEEPEE_50' : /\b60\b/.test(context) ? 'TEEPEE_60' : '';
      } else if (/BENDY/.test(context) && /\b76\b/.test(context)) {
        key = 'BENDY_76';
      } else if (/AURA/.test(context) && /\b900\b/.test(context)) {
        key = 'AURA 900';
      }
      if (key) target = entries.find(entry => entry.normalizedKey === normalize(key));
    }

    if (!target) return noMatch(`Produkt nebo jeho varianta ${clean(product?.name)} neodpovídá jednoznačně aktuálnímu kusovníku; nutné ruční ověření.`);
    if (!(target.price > 0)) return noMatch(`Položka ${target.key} nemá v řádku 2 ověřenou prodejní cenu.`);
    const vat = Math.round(target.price * 0.21);
    return {
      matched: true, sheet_key: target.key, sheet_spec: '',
      offer_price_ex_vat: target.price, vat_amount: vat, total_inc_vat: target.price + vat,
      source: `${source} / ${target.key}`,
      note: target.catalog ? '' : 'Interní produkt: není označen k publikování. Před odesláním nabídky vyžaduje schválení.',
    };
  } catch (error) {
    return noMatch(error instanceof Error ? error.message : String(error));
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
      complete_supla_ex_vat: parseMoney(totalRow?.[6]),
      complete_supla_inc_vat: parseMoney(vatTotalRow?.[6]),
      margin_percent: parseMoney(marginRow?.[5]),
    };
  } catch (_) {
    return fallback;
  }
}

export type CustomCostLine = {
  rate_key: string;
  quantity: number;
  rationale?: string;
};

export type CustomConceptPricing = {
  matched: boolean;
  source: string;
  material_basis: string;
  hzm_percent: number;
  base_cost_ex_vat: number;
  hzm_amount: number;
  offer_price_ex_vat: number;
  vat_amount: number;
  total_inc_vat: number;
  line_items: Array<{ rate_key: string; label: string; unit: string; quantity: number; unit_price: number; total: number; rationale?: string }>;
  warnings: string[];
};

const CUSTOM_RATE_COLUMNS: Record<string, { column: number; label: string; unit: string }> = {
  material_jekl_70x70x3_m: { column: 5, label: 'Jekl 70×70×3, nerez 1.4301', unit: 'm' },
  material_trubka_76_1x3_m: { column: 6, label: 'Trubka Ø76,1×3, nerez 1.4301', unit: 'm' },
  material_trubka_60_3x3_6_m: { column: 7, label: 'Trubka Ø60,3×3,6, nerez 1.4301', unit: 'm' },
  material_trubka_52x3_m: { column: 8, label: 'Trubka Ø52×3, nerez 1.4301', unit: 'm' },
  material_trubka_42_4x3_6_m: { column: 9, label: 'Trubka Ø42,4×3,6, nerez 1.4301', unit: 'm' },
  material_trubka_40x3_m: { column: 10, label: 'Trubka Ø40×3, nerez 1.4301', unit: 'm' },
  material_trubka_33_7x3_m: { column: 11, label: 'Trubka Ø33,7×3, nerez 1.4301', unit: 'm' },
  zatka_nerez_ks: { column: 12, label: 'Zátka nerez svařená', unit: 'ks' },
  mlzici_tryska_ks: { column: 13, label: 'Mlžicí tryska M2', unit: 'ks' },
  patka_uchyceni_ks: { column: 14, label: 'Patka a uchycení', unit: 'ks' },
  napojeni_vody_ks: { column: 15, label: 'Napojení vody', unit: 'ks' },
  privod_hadici_fitinky_ks: { column: 16, label: 'Přívod hadicí + fitinky', unit: 'ks' },
  zatka_imbus_ks: { column: 17, label: 'Zátka IMBUS', unit: 'ks' },
  ohybani_tech_priprava_ks: { column: 18, label: 'Ohýbání – technická příprava', unit: 'ks' },
  serizeni_rad_ks: { column: 19, label: 'Seřízení ohýbání / rádiusu', unit: 'ks' },
  ohybani_ks: { column: 20, label: 'Ohýbání', unit: 'ks' },
  deleni_obrabeni_hod: { column: 21, label: 'Dělení / obrábění materiálu', unit: 'hod' },
  svarovani_brus_hod: { column: 22, label: 'Ruční MIG/TIG svařování + brus', unit: 'hod' },
  brouseni_satenovani_hod: { column: 23, label: 'Broušení / saténování', unit: 'hod' },
  zavitovani_hod: { column: 24, label: 'Závitování', unit: 'hod' },
  testovani_hod: { column: 25, label: 'Testování', unit: 'hod' },
  brusivo_ks: { column: 26, label: 'Brusivo', unit: 'ks' },
  doprava_materialu_ks: { column: 27, label: 'Doprava materiálu', unit: 'ks' },
  montazni_vyjezd_ks: { column: 28, label: 'Montážní výjezd', unit: 'ks' },
};

export const CUSTOM_COST_KEYS = Object.keys(CUSTOM_RATE_COLUMNS);

export async function estimateCustomConceptPricing(base44: any, costPlan: CustomCostLine[], options: { hzmPercent?: number; requires316L?: boolean } = {}): Promise<CustomConceptPricing> {
  const hzmPercent = Number.isFinite(Number(options.hzmPercent)) ? Math.max(0, Math.min(80, Number(options.hzmPercent))) : 35;
  const warnings: string[] = [];
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const rateRange = encodeURIComponent(`'${PRICING_SHEET_NAME}'!A1:AC6`);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${PRICING_SPREADSHEET_ID}/values/${rateRange}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error(`Google Sheets ${response.status}: ${await response.text()}`);
    const payload = await response.json();
    const rows: any[][] = Array.isArray(payload?.values) ? payload.values : [];
    const rateRow = rows[5] || []; // řádek „Sazba“ v Kalkulace 2026

    const merged = new Map<string, CustomCostLine>();
    for (const raw of Array.isArray(costPlan) ? costPlan : []) {
      const key = String(raw?.rate_key || '').trim();
      if (!CUSTOM_RATE_COLUMNS[key]) continue;
      const quantity = Math.max(0, Number(raw?.quantity || 0));
      if (!(quantity > 0)) continue;
      const existing = merged.get(key);
      merged.set(key, {
        rate_key: key,
        quantity: (existing?.quantity || 0) + quantity,
        rationale: clean(raw?.rationale || existing?.rationale || ''),
      });
    }

    const lineItems = Array.from(merged.values()).map((line) => {
      const meta = CUSTOM_RATE_COLUMNS[line.rate_key];
      const unitPrice = parseMoney(rateRow[meta.column]);
      return {
        rate_key: line.rate_key,
        label: meta.label,
        unit: meta.unit,
        quantity: Math.round(line.quantity * 100) / 100,
        unit_price: unitPrice,
        total: Math.round(unitPrice * line.quantity),
        rationale: line.rationale,
      };
    }).filter((line) => line.unit_price > 0 && line.quantity > 0);

    const baseCost = lineItems.reduce((sum, line) => sum + line.total, 0);
    if (!(baseCost > 0)) warnings.push('Výrobní plán neobsahuje žádné nacenitelné položky z tabulky Kalkulace 2026.');
    if (options.requires316L) warnings.push('Kalkulační sazby materiálu v této tabulce vycházejí z nerezu 1.4301 / AISI 304. Požadavek na AISI 316L musí před finální nabídkou projít materiálovým přepočtem.');

    const hzmAmount = Math.round(baseCost * hzmPercent / 100);
    const rawOffer = baseCost + hzmAmount;
    const offerPrice = rawOffer > 0 ? Math.ceil(rawOffer / 50) * 50 : 0;
    const vatAmount = Math.round(offerPrice * 0.21);
    const totalIncVat = offerPrice + vatAmount;

    return {
      matched: offerPrice > 0,
      source: `Google Sheets: Mlžítko / ${PRICING_SHEET_NAME} / výrobní sazby`,
      material_basis: 'nerez 1.4301 / AISI 304 dle aktuální tabulky Kalkulace 2026',
      hzm_percent: hzmPercent,
      base_cost_ex_vat: baseCost,
      hzm_amount: hzmAmount,
      offer_price_ex_vat: offerPrice,
      vat_amount: vatAmount,
      total_inc_vat: totalIncVat,
      line_items: lineItems,
      warnings,
    };
  } catch (error) {
    return {
      matched: false,
      source: `Google Sheets: Mlžítko / ${PRICING_SHEET_NAME} / výrobní sazby`,
      material_basis: 'nerez 1.4301 / AISI 304 dle aktuální tabulky Kalkulace 2026',
      hzm_percent: hzmPercent,
      base_cost_ex_vat: 0,
      hzm_amount: 0,
      offer_price_ex_vat: 0,
      vat_amount: 0,
      total_inc_vat: 0,
      line_items: [],
      warnings: [error?.message || String(error)],
    };
  }
}

export function validatedCatalogFallback(_product: any) {
  // Staré Product.price_from ani cache nejsou povolené jako fallback do obchodní nabídky.
  return 0;
}