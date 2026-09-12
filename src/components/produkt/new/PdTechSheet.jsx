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
  const seasonDays = DEFAULT_SEASON_DAYS;
  const waterPrice = WATER_PRICE_CZK_M3;

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

        {/* 3. Zjednodušený výpočet nákladů na vodu */}
        <div className="relative overflow-hidden border-2 border-[#22D3EE] bg-[#0A1628] p-6 sm:p-9">
          <div className="flex items-center gap-2.5">
            <Calculator size={18} className="text-[#22D3EE]" />
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#22D3EE]">Kolik stojí provoz</p>
          </div>
          <h3 className="mt-4 font-heading text-2xl font-semibold tracking-[-.02em] text-white sm:text-3xl">
            Náklady na vodu za celou sezónu
          </h3>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            {/* Dva vstupy — nic víc */}
            <div className="space-y-6">
              <Stepper label="Počet trysek" value={nozzles} onChange={(v) => setNozzles(Math.min(32, Math.max(1, v)))} suffix="ks" />
              <Stepper label="Provoz denně" value={hoursDay} onChange={(v) => setHoursDay(Math.min(24, Math.max(1, v)))} suffix="h" />
              <p className="font-mono text-[10px] leading-relaxed tracking-[.1em] text-white/40">
                PEVNÉ HODNOTY: {FLOW_PER_NOZZLE_LH} l/h na trysku · {seasonDays} dní sezóna · {waterPrice} Kč/m³
              </p>
            </div>

            {/* Jedno hlavní číslo */}
            <div className="border border-white/12 bg-white/[.04] p-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/50">Voda za sezónu</p>
              <p className="mt-3 font-heading text-[clamp(2.75rem,9vw,4.5rem)] font-bold leading-none text-[#22D3EE]">
                {formatCZK(costSeason)} <span className="text-2xl">Kč</span>
              </p>
              <div className="mt-6 grid grid-cols-2 divide-x divide-white/12 border-t border-white/12 pt-5">
                <div>
                  <p className="font-heading text-lg font-bold text-white">{formatCZK(costDay)} Kč</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-white/45">za den</p>
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-white">{formatCZK(litersSeason / 1000)} m³</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-white/45">vody za sezónu</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-7 text-[11px] leading-relaxed text-white/40">
            Orientační výpočet pouze pro spotřebu vody — bez elektřiny, údržby a investice. Skutečná spotřeba se liší podle typu trysky, tlaku a počasí.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stepper({ label, value, onChange, suffix }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[.14em] text-white/50">{label}</p>
      <div className="mt-2 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          aria-label={`Snížit: ${label}`}
          className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition hover:border-[#22D3EE] hover:text-[#22D3EE]"
        >
          <Minus size={16} />
        </button>
        <span className="min-w-[4.5rem] text-center font-heading text-3xl font-bold text-white">
          {value}<span className="ml-1 text-sm font-semibold text-white/50">{suffix}</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Zvýšit: ${label}`}
          className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition hover:border-[#22D3EE] hover:text-[#22D3EE]"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}