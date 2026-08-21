import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { PRICING_SPREADSHEET_ID } from '../../shared/pricingSheet.ts';

const SHEET_NAME = 'Chytré ovládání SUPLA';
const RANGE = `'${SHEET_NAME}'!A9:H60`;

const clean = (value: unknown) => String(value || '').replace(/\s+/g, ' ').trim();
const normalize = (value: unknown) => clean(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase();
const parseMoney = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const number = Number(String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/Kč/gi, '')
    .replace(/%/g, '')
    .replace(/[^0-9,.-]/g, '')
    .replace(',', '.'));
  return Number.isFinite(number) ? number : 0;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const range = encodeURIComponent(RANGE);
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${PRICING_SPREADSHEET_ID}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error(`Google Sheets ${response.status}: ${await response.text()}`);
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

    const smartValve = rowByComponent('Chytrý ventil PEVEKO');
    const ncValve = rowByComponent('Servomotorický ventil NC');
    const row02 = rowByComponent('SUPLA ROW-02');
    const liw01 = rowByComponent('SUPLA LIW-01');
    const thw01 = rowByComponent('SUPLA THW-01');
    const waterMeter = rowByComponent('Elektronický vodoměr');
    const programming = rowByComponent('Oživení a programování');

    const componentPrice = (row: any[]) => parseMoney(row?.[5]);
    const marginFactor = marginPercent > 0 ? 1 + marginPercent / 100 : 1;
    const thwOptionExVat = componentPrice(thw01) > 0 ? Math.round(componentPrice(thw01) * marginFactor) : 0;

    // Premium varianta nahrazuje standardní NC ventil + ROW-02 chytrým PEVEKO ventilem.
    // THW-01 zůstává volitelný a není součástí standardní ceny.
    const premiumBaseCost = costBaseExVat
      - componentPrice(ncValve)
      - componentPrice(row02)
      + componentPrice(smartValve)
      + componentPrice(thw01);
    const premiumPriceExVat = premiumBaseCost > 0 ? Math.round(premiumBaseCost * marginFactor) : 0;

    const phases = [
      {
        key: 'analysis_prototype',
        title: 'Fáze 1: Analýza a prototyp',
        timing: '2–4 týdny',
        scope: 'Zmapování stávající infrastruktury, návrh zapojení, datového modelu a komunikační logiky SUPLA / API.',
        price_note: 'Součást systémové ceny balíčku.',
      },
      {
        key: 'core_scenarios',
        title: 'Fáze 2: Konfigurace řízení a provozních scénářů',
        timing: 'dle rozsahu projektu',
        scope: 'SUPLA konfigurace, časové scénáře, vzdálené ovládání, měření spotřeby a provozní logika. Vlastní externí API nebo speciální dashboard jsou volitelná rozšíření.',
        price_note: 'Součást systémové ceny balíčku; atypický software se naceňuje samostatně.',
      },
      {
        key: 'testing_deployment',
        title: 'Fáze 3: Testování, nasazení a předání',
        timing: 'dle termínu instalace',
        scope: 'Kompletace, oživení, testování, konfigurace uživatelského přístupu, základní zaškolení a předání.',
        price_note: 'Součást systémové ceny balíčku.',
      },
    ];

    return Response.json({
      ok: standardPriceExVat > 0,
      source: `Google Sheets: Mlžítko / ${SHEET_NAME}`,
      pricing_rule: 'Cena se přebírá z živé BOM kalkulace SUPLA. Neodvozuje se z délky projektu ani z AI odhadu.',
      package_name: 'SUPLA Standard',
      package_price_ex_vat: standardPriceExVat,
      package_price_inc_vat: standardPriceIncVat,
      cost_base_ex_vat: costBaseExVat,
      margin_percent: marginPercent,
      optional_thw01_ex_vat: thwOptionExVat,
      premium_package_name: 'SUPLA Premium · chytrý PEVEKO ventil + THW-01',
      premium_package_price_ex_vat: premiumPriceExVat,
      programming_hourly_rate_ex_vat: componentPrice(programming),
      phases,
      components: {
        smart_valve_peveko_ex_vat: componentPrice(smartValve),
        standard_nc_valve_ex_vat: componentPrice(ncValve),
        row02_ex_vat: componentPrice(row02),
        liw01_ex_vat: componentPrice(liw01),
        thw01_ex_vat: componentPrice(thw01),
        water_meter_ex_vat: componentPrice(waterMeter),
      },
      architecture_note: 'Standard používá NC servoventil + SUPLA ROW-02. Chytrý PEVEKO ventil je alternativní premium varianta, nikoli další povinný prvek vedle ROW-02. THW-01 je volitelný.',
      software_note: 'Oficiální SUPLA Cloud a mobilní aplikace nemají povinné předplatné. Self-hosting a vlastní API integrace mohou mít samostatné provozní a vývojové náklady.',
      tech_stack: {
        cloud: 'SUPLA Cloud',
        self_hosted: 'SUPLA Docker / self-hosted server (volitelně)',
        protocols: 'REST API / MQTT dle konkrétní integrace',
        frontend: 'SUPLA aplikace / web; vlastní dashboard jen pokud je součástí zadání',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
