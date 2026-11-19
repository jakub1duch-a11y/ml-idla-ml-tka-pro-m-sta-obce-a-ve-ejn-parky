/**
 * MLŽIDLA.cz — verified Canva design registry and safe, side-effect-free autofill preparation.
 * Connected Canva design datasets inspected on 2026-11-19.
 *
 * This module does NOT contact Canva, HubSpot, Gmail or Google Sheets, send
 * customer messages, approve artwork, or export PDF. An authenticated server
 * must supply reviewed catalogue prices and approved product image asset IDs.
 */
const OUTREACH_FIELDS = Object.freeze({
  headline: 'text', lead_text: 'text', hero_caption: 'text',
  benefit_1_heading: 'text', benefit_1_text: 'text',
  benefit_2_heading: 'text', benefit_2_text: 'text',
  benefit_3_heading: 'text', benefit_3_text: 'text',
  cta_heading: 'text', cta_text: 'text', hero_image: 'image',
});

function productFields(n) {
  const fields = { products_total_czk: 'text' };
  for (let i = 1; i <= n; i += 1) {
    fields['product_' + i + '_name'] = 'text';
    fields['product_' + i + '_qty'] = 'text';
    fields['product_' + i + '_unit_czk'] = 'text';
    fields['product_' + i + '_line_total_czk'] = 'text';
    fields['product_' + i + '_image'] = 'image';
  }
  return Object.freeze(fields);
}

/** Each ID is a real editable Canva DESIGN, not a brand-template ID. */
export const MLZ_CANVA_AUTOFILL_TEMPLATES = Object.freeze({
  outreach_mesta: Object.freeze({
    designId: 'DAHbIPt73-s', category: 'outreach', fields: OUTREACH_FIELDS,
    label: 'Oslovení měst a obcí · A4',
  }),
  outreach_architekti: Object.freeze({
    designId: 'DAHbIPfIgA8', category: 'outreach', fields: OUTREACH_FIELDS,
    label: 'Oslovení architektů · A4',
  }),
  outreach_gastro: Object.freeze({
    designId: 'DAHbIAfsc1w', category: 'outreach', fields: OUTREACH_FIELDS,
    label: 'Oslovení gastro provozů · A4',
  }),
  product_photos: Object.freeze({
    designId: 'DAHbICVcThc', category: 'photo', label: 'Produktový fotografický list · A4',
    // Canva currently incorrectly identifies the decorative text/shape
    // "main_image_type" as image. Never send this field to autofill.
    ignoredInvalidFields: Object.freeze(['main_image_type']),
    fields: Object.freeze({
      product_name: 'text', product_intro: 'text',
      main_image_heading: 'text', main_image_caption: 'text', material_note: 'text',
      environment_type: 'text', environment_caption: 'text',
      detail_type: 'text', detail_caption: 'text', photo_disclaimer: 'text',
      main_product_image: 'image', environment_image: 'image', detail_image: 'image',
    }),
  }),
  quote_duo: Object.freeze({
    designId: 'DAHbICZZIgU', category: 'price_summary', label: 'Souhrn 2 modelů · A4',
    fields: productFields(2), count: 2,
  }),
  quote_trio: Object.freeze({
    designId: 'DAHbINIjpZM', category: 'price_summary', label: 'Souhrn 3 modelů · A4',
    fields: productFields(3), count: 3,
  }),
  quote_4models: Object.freeze({
    designId: 'DAHbIO0bjWQ', category: 'price_summary', label: 'Souhrn 4 modelů · A4',
    fields: productFields(4), count: 4,
  }),
});

export const MLZ_CANVA_WORKFLOW_SETTINGS = Object.freeze({
  hubspotPortalId: 149778217,
  senderAccount: 'meduna@holmtec.cz',
  priceSpreadsheetId: '1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8',
  priceCatalogTab: '💧 Katalog produktů 2026',
  publicPriceColumns: Object.freeze({ one: 'H', two: 'J', three: 'K' }),
  forbiddenPartnerColumn: 'I',
  autoCustomerSend: false,
  autoPublish: false,
  humanApprovalRequired: true,
  installationIncludedByDefault: false,
});

/**
 * Select the correct count of Canva product SUMMARY pages BEFORE autofill.
 * A single-product quote still needs the main client quote; REV4 currently has
 * mis-typed total-price fields and must be repaired/visually reviewed.
 */
export function planMlzCanvaPages({ purpose = 'quote', segment = '', products = [] } = {}) {
  if (purpose === 'outreach') {
    const names = { mesta: 'outreach_mesta', architekti: 'outreach_architekti', gastro: 'outreach_gastro' };
    const key = names[String(segment).toLowerCase()];
    if (!key) return { ready: false, templateKeys: [], errors: ['Neznámý segment oslovení.'] };
    return { ready: true, templateKeys: [key], errors: [], draftOnly: true };
  }
  if (!Array.isArray(products) || products.length === 0) {
    return { ready: false, templateKeys: [], errors: ['V nabídce není žádný produkt.'] };
  }
  if (products.length > 4) {
    return { ready: false, templateKeys: [], errors: ['Pro více než 4 modely je nutné schválit rozdělení na další listy.'] };
  }
  const keys = [];
  if (products.length >= 2) keys.push({ 2: 'quote_duo', 3: 'quote_trio', 4: 'quote_4models' }[products.length]);
  keys.push('product_photos'); // Copy this once per product, with product-specific sources.
  return {
    ready: true, templateKeys: keys, photoSheetCopies: products.length,
    mainQuoteRequiresManualPriceFieldReview: true,
    warning: 'Hlavní nabídka REV4 není automaticky schválena: některé cenové položky mají v Canva chybný datový typ.',
    errors: [], draftOnly: true,
  };
}

export function validateMlzCanvaDataset(templateKey, actual = {}) {
  const template = MLZ_CANVA_AUTOFILL_TEMPLATES[templateKey];
  if (!template) return { valid: false, errors: ['Neznámá šablona.'] };
  const errors = [];
  for (const [name, type] of Object.entries(template.fields)) {
    if (actual[name]?.type !== type) errors.push('Pole ' + name + ' musí být ' + type + '.');
  }
  return {
    valid: errors.length === 0, errors,
    ignoredInvalidFields: template.ignoredInvalidFields || [],
  };
}

function numberCzk(value) {
  const text = typeof value === 'number' ? String(value) :
    String(value ?? '').replace(/[ \u00A0\u202F]/g, '').replace(/Kč|CZK/gi, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) && number > 0 ? number : null;
}

/**
 * Accept ONLY the authenticated server's exact catalogue row.
 * A=SKU, H=1x public, J=total for 2x, K=total for 3x.
 * Never output the I column (partner pricing) or a whole source row.
 */
export function resolvePublicMlzLinePrice({
  row, sku, quantity, accountVerified = false, sourceVerified = false,
  sourceRevision = '',
} = {}) {
  if (!accountVerified || !sourceVerified || !sourceRevision) {
    return { ready: false, reason: 'Chybí ověřený firemní účet, cenový zdroj nebo jeho revize.' };
  }
  if (!Array.isArray(row) || String(row[0] || '').trim() !== String(sku || '').trim()) {
    return { ready: false, reason: 'Neodpovídá přesná katalogová varianta.' };
  }
  if (![1, 2, 3].includes(quantity)) {
    return { ready: false, reason: 'Množství mimo ověřené sazby 1–3 ks.' };
  }
  const unit = numberCzk(row[7]);
  const total = quantity === 1 ? unit : numberCzk(row[quantity === 2 ? 9 : 10]);
  if (unit === null || total === null) {
    return { ready: false, reason: 'V aktuální kalkulaci chybí přesná veřejná cena.' };
  }
  return {
    ready: true, sku: String(sku), quantity,
    unitPriceExVatCzk: unit, lineTotalExVatCzk: total,
    priceSource: 'Kalkulace mlžítka 2026 / 💧 Katalog produktů 2026',
    priceRevision: sourceRevision,
    vatBasis: 'bez DPH', priceVerified: true,
  };
}

const money = value => new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value) + ' Kč';
const t = text => ({ type: 'text', text: String(text) });
const im = asset_id => ({ type: 'image', asset_id });

export function makeMultiModelCanvaData({ templateKey, products = [] } = {}) {
  const template = MLZ_CANVA_AUTOFILL_TEMPLATES[templateKey];
  if (template?.category !== 'price_summary' || products.length !== template.count) {
    throw new Error('Počet modelů musí souhlasit s vybranou Canva šablonou.');
  }
  const data = {}; let total = 0;
  products.forEach((p, i) => {
    if (p.priceVerified !== true || p.masterVerified !== true ||
        !p.priceSource || !p.priceRevision || !p.productName ||
        !p.productVariant || !p.canvaAssetId ||
        !Number.isInteger(p.quantity) || p.quantity < 1 ||
        !(Number.isFinite(p.unitPriceExVatCzk) && p.unitPriceExVatCzk > 0) ||
        !(Number.isFinite(p.lineTotalExVatCzk) && p.lineTotalExVatCzk > 0)) {
      throw new Error('Nevyřešená cena, MASTER vizuál nebo identita varianty produktu ' + (i + 1) + '.');
    }
    const key = 'product_' + (i + 1);
    data[key + '_name'] = t(p.productName + ' – ' + p.productVariant);
    data[key + '_qty'] = t(p.quantity + ' ks');
    data[key + '_unit_czk'] = t(money(p.unitPriceExVatCzk));
    data[key + '_line_total_czk'] = t(money(p.lineTotalExVatCzk));
    data[key + '_image'] = im(p.canvaAssetId);
    total += p.lineTotalExVatCzk;
  });
  data.products_total_czk = t(money(total) + ' bez DPH');
  return data;
}

export function makeOutreachCanvaData({ templateKey, fields = {}, canvaAssetId } = {}) {
  const template = MLZ_CANVA_AUTOFILL_TEMPLATES[templateKey];
  if (template?.category !== 'outreach' || !canvaAssetId) {
    throw new Error('Chybí segment nebo schválená produktová fotografie.');
  }
  const result = {};
  for (const [key, type] of Object.entries(template.fields)) {
    if (type === 'image') result[key] = im(canvaAssetId);
    else if (typeof fields[key] === 'string' && fields[key].trim()) result[key] = t(fields[key].trim());
    else throw new Error('Chybí schválený text Autofill pole: ' + key);
  }
  return result;
}
