// Server-side offer product sheets. Public customer prices only: H, J, K.
// Source: Kalkulace mlžítka 2026 / 💧 Katalog produktů 2026.
// Never return column I (partner price), costs or margins.
export const OFFER_CATALOG_ID = '1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8';
export const OFFER_CATALOG_RANGE = "'💧 Katalog produktů 2026'!A2:K1000";

export function parseCzkPrice(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value;
  const text = String(value ?? '').replace(/\s|\u00a0|Kč|CZK/gi, '').replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error('Neplatná nebo chybějící veřejná cena.');
  return Number(text);
}

export function buildProductOfferSheets(rows, requestedNames, { vatRate = null } = {}) {
  if (!Array.isArray(rows) || !Array.isArray(requestedNames) || !requestedNames.length) throw new Error('Chybí katalog nebo požadované produkty.');
  if (vatRate !== null && (!Number.isFinite(vatRate) || vatRate < 0 || vatRate > 1)) throw new Error('Neplatná sazba DPH.');
  const names = new Set();
  return requestedNames.map(requested => {
    const key = String(requested).trim().toLocaleLowerCase('cs');
    if (!key || names.has(key)) throw new Error('Neplatná nebo duplicitní varianta.');
    names.add(key);
    const matches = rows.filter(row => String(row?.[0] ?? '').trim().toLocaleLowerCase('cs') === key);
    if (matches.length !== 1) throw new Error('Varianta není v katalogu jednoznačná: ' + requested);
    const row = matches[0];
    const amounts = [row[7], row[9], row[10]].map(parseCzkPrice);
    if (amounts.some(amount => amount <= 0)) throw new Error('Cena musí být kladná: ' + requested);
    const quantityPrices = amounts.map((totalExVat, index) => {
      const quantity = index + 1;
      const result = { quantity, total_ex_vat: totalExVat, unit_ex_vat: Math.round(totalExVat / quantity * 100) / 100 };
      if (vatRate !== null) {
        result.vat_amount = Math.round(totalExVat * vatRate * 100) / 100;
        result.total_inc_vat = Math.round((totalExVat + result.vat_amount) * 100) / 100;
      }
      return result;
    });
    return {
      product_name: String(row[0]).trim(),
      description: String(row[1] ?? ''),
      profile_catalog: String(row[2] ?? ''),
      height_mm: row[3] ?? null,
      width_mm: row[4] ?? null,
      depth_mm: row[5] ?? null,
      nozzle_count: row[6] ?? null,
      prices: quantityPrices,
      price_source: { spreadsheet_id: OFFER_CATALOG_ID, range: OFFER_CATALOG_RANGE, columns: ['H','J','K'] },
      author: 'Ing. Radek Meduna',
      company: 'HolmTec s.r.o.',
      brand: 'MLŽIDLA.cz',
      requires_master_visual_verification: true,
      status: 'NEEDS_REVIEW',
    };
  });
}
