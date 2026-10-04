import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { fetchSuplaPricing, SUPLA_SHEET_NAME } from '../../shared/suplaPricing.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const pricing = await fetchSuplaPricing(base44);
    if (!pricing || pricing.standard_price_ex_vat <= 0) {
      return Response.json({ ok: false, error: 'SUPLA pricing not available from Google Sheets' }, { status: 502 });
    }

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
      ok: pricing.standard_price_ex_vat > 0,
      source: `Google Sheets: Mlžítko / ${SUPLA_SHEET_NAME}`,
      pricing_rule: 'Cena se přebírá z živé BOM kalkulace SUPLA. Neodvozuje se z délky projektu ani z AI odhadu.',
      package_name: 'SUPLA Standard',
      package_price_ex_vat: pricing.standard_price_ex_vat,
      package_price_inc_vat: pricing.standard_price_inc_vat,
      cost_base_ex_vat: pricing.cost_base_ex_vat,
      margin_percent: pricing.margin_percent,
      optional_thw01_ex_vat: pricing.thw01_option_ex_vat,
      premium_package_name: 'SUPLA Premium · chytrý PEVEKO ventil + THW-01',
      premium_package_price_ex_vat: pricing.premium_price_ex_vat,
      programming_hourly_rate_ex_vat: pricing.programming_hourly_rate,
      phases,
      components: {
        smart_valve_peveko_ex_vat: pricing.components.smart_valve_peveko,
        standard_nc_valve_ex_vat: pricing.components.nc_valve,
        row02_ex_vat: pricing.components.row02,
        liw01_ex_vat: pricing.components.liw01,
        thw01_ex_vat: pricing.components.thw01,
        water_meter_ex_vat: pricing.components.water_meter,
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
}