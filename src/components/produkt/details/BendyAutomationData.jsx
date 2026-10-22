import React from 'react';
import { Link } from 'react-router-dom';
import { calculateWaterCost, formatNumber, getNozzleModels, NOZZLE_TYPES, WATER_TARIFF } from '@/components/produkt/nozzles/nozzleData';
import '@/components/produkt/nozzles/nozzleConfigurator.css';

export default function BendyAutomationData() {
  const models = getNozzleModels('mlzitko-bendy');
  const flow = NOZZLE_TYPES.find(n => n.id === 'M2').flows[2];
  return <div className="bg-muted px-5 py-8 sm:px-10 lg:py-12">
    <div className="mx-auto max-w-7xl">
      <h3 className="font-heading text-2xl">Co znamená provozní cyklus pro spotřebu?</h3>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">Modelový příklad: 8hodinové provozní okno, trysky M2 při 2 bar. Cyklus 30 sekund mlžení a 90 sekund pauzy znamená celkem 2 hodiny otevřeného ventilu, nikoli 8 hodin souvislého mlžení.</p>
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[460px] text-left text-sm tabular-nums">
        <caption className="sr-only">Porovnání průběžného a cyklického provozu BENDY</caption>
        <thead><tr className="border-b border-border"><th scope="col" className="py-3 pr-4">Provedení</th><th scope="col" className="py-3 pr-4">Souvisle / 8 h</th><th scope="col" className="py-3">Cyklus 30 / 90 s</th></tr></thead>
        <tbody>{models.map(m => { const full = calculateWaterCost(m.count, flow, WATER_TARIFF); const cycle = calculateWaterCost(m.count, flow, WATER_TARIFF, 2); return <tr key={m.id} className="border-b border-border"><th scope="row" className="py-4 pr-4">{m.name} · {m.count} {m.count === 3 ? 'trysky' : 'trysek'}</th><td className="py-4 pr-4">{formatNumber(full.liters)} l · {formatNumber(full.cost)} Kč</td><td className="py-4">{formatNumber(cycle.liters)} l · {formatNumber(cycle.cost)} Kč</td></tr>; })}</tbody>
      </table></div>
      <p className="mt-4 text-xs text-muted-foreground">Pouze cena vody při historické sazbě 126,52 Kč/m³ (Trutnov 2024, vodné a stočné). Nejde o měření ani o 75% úsporu při stejném chladicím účinku: cyklus jednoduše mlží čtvrtinu času. Vhodnou délku cyklu je třeba navrhnout.</p>
      <div className="mt-6 flex flex-wrap gap-4"><Link to="/smart-ovladani" className="nozzle-cta">Možnosti automatického řízení</Link><a href="#varianty-mlhy" className="nozzle-cta">Upravit výpočet spotřeby</a></div>
    </div>
  </div>;
}