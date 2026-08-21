import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { PRICING_SPREADSHEET_ID } from '../../shared/pricingSheet.ts';

const SHEET_NAME = 'Chytré ovládání SUPLA';
const RANGE = `'${SHEET_NAME}'!A9:H80`;
const HOURS_PER_WEEK = 40;

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
    .replace(/[^0-9,.-]/g, '')
    .replace(',', '.'));
  return Number.isFinite(number) ? number : 0;
};
const round50 = (value: number) => value > 0 ? Math.ceil(value / 50) * 50 : 0;

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

    const programmingRow = rows.find((row) => normalize(row?.[2]) === 'OZIVENI A PROGRAMOVANI');
    const programmingQty = Math.max(0, parseMoney(programmingRow?.[4]));
    const programmingUnit = Math.max(0, parseMoney(programmingRow?.[5]));
    const programmingTotal = Math.max(0, parseMoney(programmingRow?.[6]));
    const hourlyRate = programmingUnit > 0
      ? programmingUnit
      : programmingQty > 0 && programmingTotal > 0
        ? programmingTotal / programmingQty
        : 0;

    const completeRow = rows.find((row) => normalize(row?.[3]) === 'CENA BEZ DPH');
    const completeSuplaExVat = Math.max(0, parseMoney(completeRow?.[5] || completeRow?.[6]));

    const phaseDefs = [
      {
        key: 'analysis_prototype',
        title: 'Fáze 1: Analýza a Prototyp',
        weeks_min: 2,
        weeks_max: 4,
        scope: 'Detailní zmapování SUPLA infrastruktury klienta, návrh datového modelu a zprovoznění komunikace MQTT/API.',
      },
      {
        key: 'core_scenarios',
        title: 'Fáze 2: Vývoj jádra a provozních scénářů',
        weeks_min: 6,
        weeks_max: 10,
        scope: 'Vývoj logiky smart řízení, integrace spotového trhu a provozního dashboardu.',
      },
      {
        key: 'testing_deployment',
        title: 'Fáze 3: Testování, nasazení a garance',
        weeks_min: 2,
        weeks_max: 3,
        scope: 'Simulace krizových stavů, ladění algoritmů v reálném provozu, zaškolení personálu a předání dokumentace.',
      },
    ];

    const phases = phaseDefs.map((phase) => {
      const hoursMin = phase.weeks_min * HOURS_PER_WEEK;
      const hoursMax = phase.weeks_max * HOURS_PER_WEEK;
      return {
        ...phase,
        hours_min: hoursMin,
        hours_max: hoursMax,
        price_min_ex_vat: hourlyRate > 0 ? round50(hoursMin * hourlyRate) : 0,
        price_max_ex_vat: hourlyRate > 0 ? round50(hoursMax * hourlyRate) : 0,
      };
    });

    const softwareMin = phases.reduce((sum, phase) => sum + Number(phase.price_min_ex_vat || 0), 0);
    const softwareMax = phases.reduce((sum, phase) => sum + Number(phase.price_max_ex_vat || 0), 0);

    return Response.json({
      ok: hourlyRate > 0,
      source: `Google Sheets: Mlžítko / ${SHEET_NAME}`,
      pricing_rule: 'Cena projektových fází = systémová hodinová sazba „Oživení a programování“ × rozsah práce. AI cenu nevymýšlí.',
      hourly_rate_ex_vat: hourlyRate,
      hours_per_week: HOURS_PER_WEEK,
      phases,
      software_total_min_ex_vat: softwareMin,
      software_total_max_ex_vat: softwareMax,
      complete_supla_hardware_ex_vat: completeSuplaExVat,
      total_with_complete_hardware_min_ex_vat: softwareMin + completeSuplaExVat,
      total_with_complete_hardware_max_ex_vat: softwareMax + completeSuplaExVat,
      hardware_note: 'Kompletní SUPLA HW je samostatná položka. Do projektových fází se přičítá pouze tehdy, pokud má být součástí dodávky.',
      tech_stack: {
        backend: 'Python / Node.js',
        hardware_communication: 'SUPLA Cloud API / SUPLA Self-hosted Server (Docker)',
        protocols: 'REST, MQTT, TLS',
        frontend: 'React / Vue.js',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
});
