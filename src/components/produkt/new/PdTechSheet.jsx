import React, { useState, useMemo } from 'react';
import { Droplets, Minus, Plus, Cpu, Gauge, Wifi, Thermometer, ShieldCheck, Clock, Calculator } from 'lucide-react';

// Standardní referenční hodnoty pro výpočet provozních nákladů na vodu
const FLOW_PER_NOZZLE_LH = 12; // l/h na trysku při referenčním tlaku 4 bar
const WATER_PRICE_CZK_M3 = 33; // Kč/m³ — průměrná municipální cena vody v ČR (s poplatky)
const DEFAULT_HOURS_DAY = 8;
const DEFAULT_SEASON_DAYS = 90;

// Koncizní parametry SUPLA řízení pro úředníky
const SUPLA_PARAMS = [
  { icon: Cpu, label: 'Řídicí jednotka', standard: 'SUPLA ROW-02', premium: 'SUPLA ROW-02', spec: 'Wi-Fi 2.4 GHz · 2× relé NO/NC · 12–24 V' },
  { icon: Gauge, label: 'Ventil', standard: 'Servomotorický NC', premium: 'Chytrý PEVEKO', spec: 'DN15–DN50 · NC · 230 V AC' },
  { icon: Droplets, label: 'Měření spotřeby', standard: 'LIW-01 + vodoměr', premium: 'LIW-01 + vodoměr', spec: 'Pulsní vstup · 0.5–15 m³/h' },
  { icon: Thermometer, label: 'Teplotní senzor', standard: '— (volitelný)', premium: 'THW-01', spec: '±0.5 °C · -10 až +85 °C · IP65' },
  { icon: Wifi, label: 'Komunikace', standard: 'SUPLA Cloud (Wi-Fi)', premium: 'SUPLA Cloud + záloha', spec: 'Bez povinného předplatného' },
  { icon: ShieldCheck, label: 'Záloha / bezpečnost', standard: 'NC (sp closed)', premium: 'Baterie + auto-uzavření', spec: 'Funguje i při výpadku řadiče' },
];

function formatCZK(n) {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function PdTechSheet({ product }) {
  // Výchozí počet trysek — z produktu nebo standard 6
  const defaultNozzles = useMemo(() => {
    const m = product?.water_consumption && String(product.water_consumption).match(/(\d+)\s*trys/i);
    return m ? parseInt(m[1], 10) : 6;
  }, [product]);

  const [nozzles, setNozzles] = useState(defaultNozzles);
  const [hoursDay, setHoursDay] = useState(DEFAULT_HOURS_DAY);
  const [seasonDays, setSeasonDays] = useState(DEFAULT_SEASON_DAYS);
  const [waterPrice, setWaterPrice] = useState(WATER_PRICE_CZK_M3);

  const litersHour = nozzles * FLOW_PER_NOZZLE_LH;
  const litersDay = litersHour * hoursDay;
  const litersSeason = litersDay * seasonDays;
  const costDay = (litersDay / 1000) * waterPrice;
  const costSeason = (litersSeason / 1000) * waterPrice;

  // Specifikace mlžítka z dat produktu
  const specRows = [
    product?.material && { label: 'Materiál', value: product.material },
    product?.pressure && { label: 'Provozní tlak', value: product.pressure },
    product?.micron_size && { label: 'Trysky / velikost kapek', value: product.micron_size },
    product?.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product?.coverage_area && { label: 'Rozměr / dosah', value: product.coverage_area },
    product?.power_supply && { label: 'Napájení / řízení', value: product.power_supply },
  ].filter(Boolean);

  return (
    <section className="bg-[#F8FCFE] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Technický list pro úředníky</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight tracking-[-.03em] text-[#0D2F4F] lg:text-4xl">
            Parametry a provozní náklady
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#0D2F4F]/60">
            Přehledné tabulky technických parametrů mlžítka, možností chytrého řízení SUPLA a kalkulačka
            provozních nákladů na vodu podle počtu trysek — pro rychlé rozhodování rad města a projektantů.
          </p>
        </div>

        {/* 1. Specifikace mlžítka */}
        <div className="mb-8">
          <h3 className="mb-4 font-heading text-lg text-[#0D2F4F]">Specifikace mlžítka</h3>
          {specRows.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[#EAF5FB] bg-white">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {specRows.map((r, i) => (
                    <tr key={r.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFE]'}>
                      <td className="w-2/5 px-5 py-3.5 font-mono text-xs uppercase tracking-wide text-[#0D2F4F]/50 align-top">
                        {r.label}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium leading-relaxed text-[#0D2F4F] align-top">
                        {r.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-[#EAF5FB] bg-white p-5 text-sm text-[#0D2F4F]/55">
              Technické parametry tohoto produktu doplníme podle konkrétní konfigurace projektu.
            </div>
          )}
        </div>

        {/* 2. Parametry SUPLA řízení */}
        <div className="mb-8">
          <h3 className="mb-4 font-heading text-lg text-[#0D2F4F]">Parametry chytrého řízení SUPLA</h3>
          <div className="overflow-x-auto rounded-xl border border-[#EAF5FB] bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0D2F4F] text-white">
                  <th className="px-4 py-3.5 font-mono text-[10px] uppercase tracking-wide font-semibold">Parametr</th>
                  <th className="px-4 py-3.5 font-mono text-[10px] uppercase tracking-wide font-semibold">Specifikace</th>
                  <th className="px-4 py-3.5 font-mono text-[10px] uppercase tracking-wide font-semibold text-center">Standard</th>
                  <th className="px-4 py-3.5 font-mono text-[10px] uppercase tracking-wide font-semibold text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {SUPLA_PARAMS.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <tr key={p.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FCFE]'}>
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF5FB] text-[#0B5EA8]">
                            <Icon size={14} strokeWidth={1.6} />
                          </span>
                          <span className="font-heading text-sm font-semibold text-[#0D2F4F]">{p.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 align-top text-xs leading-relaxed text-[#0D2F4F]/70">{p.spec}</td>
                      <td className="px-4 py-3.5 text-center align-top text-sm font-medium text-[#0D2F4F]/80">{p.standard}</td>
                      <td className="px-4 py-3.5 text-center align-top text-sm font-semibold text-[#0B5EA8]">{p.premium}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[#0D2F4F]/45">
            Konkrétní dimenze ventilu (DN) a počet zón se volí podle hydrauliky projektu. SUPLA Cloud a mobilní aplikace nemají povinné předplatné.
          </p>
        </div>

        {/* 3. Kalkulačka provozních nákladů na vodu */}
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <Calculator size={18} className="text-[#0B5EA8]" />
            <h3 className="font-heading text-lg text-[#0D2F4F]">Spotřeba vody a provozní náklady</h3>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Vstupy */}
            <div className="rounded-xl border border-[#EAF5FB] bg-white p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/50">Zadání parametrů</p>

              {/* Počet trysek */}
              <div className="flex items-center justify-between py-3 border-b border-[#EAF5FB]">
                <div>
                  <span className="block text-sm font-medium text-[#0D2F4F]">Počet trysek</span>
                  <span className="text-xs text-[#0D2F4F]/45">standard: {FLOW_PER_NOZZLE_LH} l/h na trysku při 4 bar</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNozzles((n) => Math.max(1, n - 1))}
                    className="flex h-8 w-8 items-center justify-center border border-[#EAF5FB] text-[#0D2F4F]/60 transition-colors hover:border-[#0B5EA8] hover:text-[#0B5EA8]"
                    aria-label="Snížit počet trysek"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono text-base font-semibold text-[#0D2F4F]">{nozzles}</span>
                  <button
                    onClick={() => setNozzles((n) => Math.min(32, n + 1))}
                    className="flex h-8 w-8 items-center justify-center border border-[#EAF5FB] text-[#0D2F4F]/60 transition-colors hover:border-[#0B5EA8] hover:text-[#0B5EA8]"
                    aria-label="Zvýšit počet trysek"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Hodiny denně */}
              <NumberRow
                label="Provozní hodiny / den"
                hint="standard: 8 h (denní peak)"
                value={hoursDay}
                onChange={setHoursDay}
                min={1}
                max={24}
              />

              {/* Dny v sezóně */}
              <NumberRow
                label="Dny v sezóně"
                hint="standard: 90 dní (letní sezóna)"
                value={seasonDays}
                onChange={setSeasonDays}
                min={1}
                max={365}
              />

              {/* Cena vody */}
              <NumberRow
                label="Cena vody (Kč/m³)"
                hint="standard: 33 Kč/m³ (český municipální průměr)"
                value={waterPrice}
                onChange={setWaterPrice}
                min={1}
                max={200}
              />
            </div>

            {/* Výsledky */}
            <div className="rounded-xl border border-[#0B5EA8] bg-[#0D2F4F] p-5 text-white">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-white/50">Výpočet provozních nákladů (pouze voda)</p>

              <div className="space-y-3">
                <ResultRow label="Spotřeba za hodinu" value={`${litersHour} l/h`} />
                <ResultRow label={`Spotřeba za den (${hoursDay} h)`} value={`${formatCZK(litersDay)} l`} />
                <ResultRow label={`Spotřeba za sezónu (${seasonDays} dní)`} value={`${formatCZK(litersSeason)} l`} />
              </div>

              <div className="my-4 border-t border-white/15" />

              <div className="space-y-3">
                <ResultRow label="Náklady za den (voda)" value={`${formatCZK(costDay)} Kč`} accent />
                <ResultRow label={`Náklady za sezónu (voda)`} value={`${formatCZK(costSeason)} Kč`} accent bold />
              </div>

              <p className="mt-5 text-[11px] leading-relaxed text-white/40">
                Orientační výpočet zohledňuje pouze spotřebu vody. Neobsahuje elektrickou energii, údržbu ani investiční náklady.
                Skutečná spotřeba se liší dle typu trysky, provozního tlaku a počasí.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberRow({ label, hint, value, onChange, min, max }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#EAF5FB] last:border-b-0">
      <div>
        <span className="block text-sm font-medium text-[#0D2F4F]">{label}</span>
        <span className="text-xs text-[#0D2F4F]/45">{hint}</span>
      </div>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
        className="w-20 border border-[#EAF5FB] bg-[#F8FCFE] px-3 py-1.5 text-center font-mono text-sm font-semibold text-[#0D2F4F] outline-none focus:border-[#0B5EA8]"
      />
    </div>
  );
}

function ResultRow({ label, value, accent, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${accent ? 'text-white/60' : 'text-white/45'}`}>{label}</span>
      <span className={`font-mono text-sm ${bold ? 'text-[#22D3EE] font-bold text-base' : accent ? 'text-[#22D3EE] font-semibold' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}