import React from 'react';
import { calculateWaterCost, formatNumber, WATER_TARIFF } from '@/components/produkt/nozzles/nozzleData';

const MODES = [
  { label: 'M2 · 2 bar', flow: 6.4 },
  { label: 'M2 · 5 bar', flow: 10.2 },
];

export default function MrakVariantSpecs({ model }) {
  const rows = [
    ['Výška', model.height],
    ['Rozměry', model.dimensions],
    ['Počet trysek', `${model.count} ks`],
    ['Materiál', 'Nerezová ocel'],
    ['Typ', model.concept ? 'Designový návrh' : 'Katalogová varianta'],
    ['Zdroj údajů', model.source],
  ];
  return (
    <section className="bg-background px-5 py-14 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs text-muted-foreground">TECHNICKÉ PARAMETRY</p>
          <h2 className="mt-3 font-heading">Parametry varianty</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 gap-4 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">SPOTŘEBA VODY</p>
          <h2 className="mt-3 font-heading">Provoz za 8 hodin</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {MODES.map((m) => {
              const r = calculateWaterCost(model.count, m.flow, WATER_TARIFF);
              return (
                <div key={m.label} className="border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="mt-2 font-heading text-2xl">{formatNumber(model.count * m.flow)} l/h</p>
                  <p className="mt-2 text-sm">{formatNumber(r.liters)} l · {formatNumber(r.cost)} Kč / 8 h*</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">* Pouze voda, sazba {formatNumber(WATER_TARIFF)} Kč/m³. {model.note}</p>
        </div>
      </div>
    </section>
  );
}