import React from 'react';
import { Droplets, Cpu, Gauge, Wifi, Thermometer, ShieldCheck } from 'lucide-react';
import PdCostCalculator from '@/components/produkt/new/PdCostCalculator';

// Koncizní parametry SUPLA řízení pro úředníky
const SUPLA_PARAMS = [
  { icon: Cpu, label: 'Řídicí jednotka', standard: 'SUPLA ROW-02', premium: 'SUPLA ROW-02', spec: 'Wi-Fi 2.4 GHz · 2× relé NO/NC · 12–24 V' },
  { icon: Gauge, label: 'Ventil', standard: 'Servomotorický NC', premium: 'Chytrý PEVEKO', spec: 'DN15–DN50 · NC · 230 V AC' },
  { icon: Droplets, label: 'Měření spotřeby', standard: 'LIW-01 + vodoměr', premium: 'LIW-01 + vodoměr', spec: 'Pulsní vstup · 0.5–15 m³/h' },
  { icon: Thermometer, label: 'Teplotní senzor', standard: '— (volitelný)', premium: 'THW-01', spec: '±0.5 °C · -10 až +85 °C · IP65' },
  { icon: Wifi, label: 'Komunikace', standard: 'SUPLA Cloud (Wi-Fi)', premium: 'SUPLA Cloud + záloha', spec: 'Bez povinného předplatného' },
  { icon: ShieldCheck, label: 'Záloha / bezpečnost', standard: 'NC (sp closed)', premium: 'Baterie + auto-uzavření', spec: 'Funguje i při výpadku řadiče' },
];

export default function PdTechSheet({ product }) {
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
            Parametry chytrého řízení SUPLA a interaktivní odhad provozních nákladů na vodu —
            pro rychlé rozhodování rad města a projektantů.
          </p>
        </div>

        {/* 1. Parametry SUPLA řízení */}
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

        {/* 3. Interaktivní odhad provozních nákladů */}
        <PdCostCalculator product={product} />
      </div>
    </section>
  );
}