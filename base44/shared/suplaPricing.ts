import { PRICING_SPREADSHEET_ID } from './pricingSheet.ts';

export const SUPLA_SHEET_NAME = 'Chytré ovládání SUPLA';
export const SUPLA_RANGE = `'${SUPLA_SHEET_NAME}'!A9:H60`;

export const clean = (value: unknown) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const parseMoney = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const number = Number(String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/Kč/gi, '')
    .replace(/%/g, '')
    .replace(/[^0-9,.-]/g, '')
    .replace(',', '.'));
  return Number.isFinite(number) ? number : 0;
};

export const normalize = (value: unknown) => clean(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase();

export interface SuplaPricing {
  standard_price_ex_vat: number;
  standard_price_inc_vat: number;
  cost_base_ex_vat: number;
  margin_percent: number;
  thw01_option_ex_vat: number;
  premium_price_ex_vat: number;
  programming_hourly_rate: number;
  components: {
    smart_valve_peveko: number;
    nc_valve: number;
    row02: number;
    liw01: number;
    thw01: number;
    water_meter: number;
  };
}

export async function fetchSuplaPricing(base44: any): Promise<SuplaPricing | null> {
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const range = encodeURIComponent(SUPLA_RANGE);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${PRICING_SPREADSHEET_ID}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) return null;
    const payload = await response.json();
    const rows: any[][] = Array.isArray(payload?.values) ? payload.values : [];

    const rowByComponent = (name: string) => rows.find((row) => normalize(row?.[2]) === normalize(name));
    const priceExVatRow = rows.find((row) => normalize(row?.[3]) === 'CENA BEZ DPH');
    const vatTotalRow = rows.find((row) => normalize(row?.[3]) === 'CELKEM S DPH');
    const costTotalRow = rows.find((row) => normalize(row?.[3]) === 'CELKEM:');
    const marginRow = rows.find((row) => normalize(row?.[3]) === 'MARZE:');

    const standardPriceExVat = parseMoney(priceExVatRow?.[6]);
    const standardPriceIncVat = parseMoney(vatTotalRow?.[6]);
    const costBaseExVat = parseMoney(costTotalRow?.[6]);
    const marginPercent = parseMoney(marginRow?.[5]);

    const componentPrice = (row: any[]) => parseMoney(row?.[5]);
    const marginFactor = marginPercent > 0 ? 1 + marginPercent / 100 : 1;

    const smartValve = rowByComponent('Chytrý ventil PEVEKO');
    const ncValve = rowByComponent('Servomotorický ventil NC');
    const row02 = rowByComponent('SUPLA ROW-02');
    const liw01 = rowByComponent('SUPLA LIW-01');
    const thw01 = rowByComponent('SUPLA THW-01');
    const waterMeter = rowByComponent('Elektronický vodoměr');
    const programming = rowByComponent('Oživení a programování');

    const thwOptionExVat = componentPrice(thw01) > 0 ? Math.round(componentPrice(thw01) * marginFactor) : 0;
    const premiumBaseCost = costBaseExVat - componentPrice(ncValve) - componentPrice(row02) + componentPrice(smartValve) + componentPrice(thw01);
    const premiumPriceExVat = premiumBaseCost > 0 ? Math.round(premiumBaseCost * marginFactor) : 0;

    return {
      standard_price_ex_vat: standardPriceExVat,
      standard_price_inc_vat: standardPriceIncVat,
      cost_base_ex_vat: costBaseExVat,
      margin_percent: marginPercent,
      thw01_option_ex_vat: thwOptionExVat,
      premium_price_ex_vat: premiumPriceExVat,
      programming_hourly_rate: componentPrice(programming),
      components: {
        smart_valve_peveko: componentPrice(smartValve),
        nc_valve: componentPrice(ncValve),
        row02: componentPrice(row02),
        liw01: componentPrice(liw01),
        thw01: componentPrice(thw01),
        water_meter: componentPrice(waterMeter),
      },
    };
  } catch {
    return null;
  }
}