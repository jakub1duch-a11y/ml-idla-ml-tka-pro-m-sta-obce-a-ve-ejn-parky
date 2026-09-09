import React from 'react';

export default function PdSpecs({ product }) {
  const rows = [
    product.material && { label: 'Materiál', value: product.material },
    product.pressure && { label: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product.micron_size && { label: 'Trysky / velikost kapek', value: product.micron_size },
    product.coverage_area && { label: 'Rozměr / dosah', value: product.coverage_area },
    product.power_supply && { label: 'Napájení / řízení', value: product.power_supply },
  ].filter(Boolean);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Technické parametry</p>
            <h2 className="mt-4 font-heading text-3xl leading-tight tracking-[-.03em] text-[#0D2F4F] lg:text-4xl">Potvrzená data produktu</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#0D2F4F]/55">Zobrazujeme pouze hodnoty uložené u konkrétního produktu. Přesné kotvení, trysky, připojení vody a smart řízení se vždy doplní podle místa instalace a schváleného technického návrhu.</p>
        </div>

        {rows.length > 0 ? (
          <div className="mt-10 divide-y divide-[#EAF5FB] border-y border-[#EAF5FB]">
            {rows.map((r) => (
              <div key={r.label} className="grid gap-2 py-5 sm:grid-cols-[.7fr_1.3fr] sm:items-start">
                <span className="font-mono text-xs uppercase tracking-wide text-[#0D2F4F]/45">{r.label}</span>
                <span className="text-sm font-medium leading-relaxed text-[#0D2F4F] sm:text-right">{r.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-[#EAF5FB] bg-[#F8FCFE] p-6 text-sm leading-relaxed text-[#0D2F4F]/60">Technické parametry tohoto produktu doplníme podle konkrétní konfigurace projektu.</div>
        )}
      </div>
    </section>
  );
}
