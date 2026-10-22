import React, { useState } from 'react';
import { getNozzleModels, NOZZLE_TYPES, calculateWaterCost, formatNumber, WATER_TARIFF } from '@/components/produkt/nozzles/nozzleData';
import { BENDY_NOZZLE_IMAGES } from '@/components/produkt/details/bendyDetailContent';
import DetailPhotoSection from '@/components/produkt/details/DetailPhotoSection';
import '@/components/produkt/nozzles/nozzleConfigurator.css';

export default function BendyNozzleStory() {
  const [active, setActive] = useState(0);
  const models = getNozzleModels('mlzitko-bendy');
  const model = models[active];
  const flow = NOZZLE_TYPES.find(n => n.id === 'M2').flows[2];
  const result = calculateWaterCost(model.count, flow, WATER_TARIFF);
  const item = { id: 'osazeni', eyebrow: '05 / TRYSKY A SPOTŘEBA', title: `${model.name}. Osazení ${model.count} tryskami.`, image: BENDY_NOZZLE_IMAGES[active], alt: `AI návrh vzhledu ${model.name} s mlhou`, text: 'Dvě katalogová provedení, přehledně oddělená. Počet trysek a výpočet jsou převzaté z tabulkových podkladů; obrázek přibližuje vzhled, nikoli přesné výrobní rozmístění.', note: 'AI náhled osazení není výrobní výkres. Katalogový počet dokládá číselné schéma níže; přesná poloha a směr trysek vyžadují potvrzení podle vybraného provedení.' };
  return <div>
    <div className="flex flex-wrap justify-center gap-3 border-t border-border bg-background px-5 py-6" role="group" aria-label="Vyberte provedení BENDY">
      {models.map((m, i) => <button key={m.id} type="button" onClick={() => setActive(i)} aria-pressed={i === active} className="nozzle-selection min-h-12 px-6 py-3 font-semibold">{i === active ? 'Vybráno · ' : ''}{m.name} · {m.count} {m.count === 3 ? 'trysky' : 'trysek'}</button>)}
    </div>
    <DetailPhotoSection item={item}>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-10 lg:grid-cols-2">
        <div><p className="text-sm font-semibold">Schéma počtu, nikoli polohy trysek</p><ol className="mt-4 flex gap-3" aria-label={`${model.count} trysek`}>{Array.from({ length: model.count }, (_, i) => <li key={i} className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted font-mono text-primary">{i + 1}</li>)}</ol></div>
        <div aria-live="polite"><p className="text-sm font-semibold">M2 · 2 bar · nepřetržitých 8 hodin</p><p className="mt-2 font-heading text-3xl text-primary">{formatNumber(result.liters)} l · {formatNumber(result.cost)} Kč</p><p className="mt-3 text-xs text-muted-foreground">{model.count} × {formatNumber(flow)} l/h × 8 h. Pouze voda, historická sazba 126,52 Kč/m³. Aktuální cenu a jiné osazení upravíte v kalkulaci nad touto sekcí.</p></div>
      </div>
    </DetailPhotoSection>
  </div>;
}