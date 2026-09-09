import React from 'react';

export default function PdSpecs({ product }) {
  const rows = [
    product.material && { label: 'Materiál', value: product.material },
    product.pressure && { label: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product.micron_size && { label: 'Velikost kapek', value: product.micron_size },
    product.coverage_area && { label: 'Rozměr / dosah', value: product.coverage_area },
    product.power_supply && { label: 'Napájení / řízení', value: product.power_supply },
    { label: 'Ovládání', value: 'Manuálně, časovač nebo smart ventil (Bluetooth/Wi-Fi) — volitelně' },
    { label: 'Kotvení', value: 'Patka do betonu / zemní vrut' },
  ].filter(Boolean);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Technické parametry</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">Parametry produktu</h2>
        <div className="mt-10 divide-y divide-[#EAF5FB] border-y border-[#EAF5FB]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-6 py-4">
              <span className="font-mono text-xs uppercase tracking-wide text-[#0D2F4F]/50">{r.label}</span>
              <span className="text-right text-sm font-medium text-[#0D2F4F]">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}