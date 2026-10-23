import React, { useState } from 'react';
import { calculateWaterCost, formatNumber, getNozzleModels, NOZZLE_TYPES, WATER_TARIFF } from '@/components/produkt/nozzles/nozzleData';
import '@/components/produkt/nozzles/nozzleConfigurator.css';

export default function DetailNozzleData({ product }) {
  const [active, setActive] = useState(0);
  const models = getNozzleModels(product.slug);
  const model = models[active] || models[0];
  if (!model) return null;
  const flow = NOZZLE_TYPES.find(n => n.id === 'M2').flows[2];
  const result = calculateWaterCost(model.count, flow, WATER_TARIFF);
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10">
    {models.length > 1 && <div role="group" aria-label="Katalogové osazení" className="mb-6 flex flex-wrap gap-3">{models.map((m, i) => <button key={m.id} type="button" aria-pressed={i === active} onClick={() => setActive(i)} className="nozzle-selection min-h-12 px-4 py-3 font-semibold">{i === active ? 'Vybráno · ' : ''}{m.name} · trysek: {m.count}</button>)}</div>}
    <div className="grid gap-6 lg:grid-cols-2">
      <div><p className="text-sm font-semibold">{model.name} · schéma počtu, nikoli polohy trysek</p><ol className="mt-4 flex flex-wrap gap-2" aria-label={`${model.count} trysek`}>{Array.from({ length: model.count }, (_, i) => <li key={i} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-primary">{i + 1}</li>)}</ol><p className="mt-3 text-xs text-muted-foreground">{model.source}. Výběr mění tento výpočet, nikoli ilustrační fotografii nebo samostatnou kalkulaci výše.</p></div>
      <div aria-live="polite"><p className="text-sm font-semibold">M2 · 2 bar · nepřetržitých 8 hodin</p><p className="mt-2 font-heading text-3xl text-primary">{formatNumber(result.liters)} l · {formatNumber(result.cost)} Kč</p><p className="mt-3 text-xs text-muted-foreground">{model.count} × {formatNumber(flow)} l/h × 8 h. Pouze voda, historická sazba {formatNumber(WATER_TARIFF)} Kč/m³ (Trutnov 2024, vodné a stočné). Aktuální cenu a jiné osazení upravíte v kalkulaci nad touto sekcí.</p></div>
    </div>
  </div>;
}