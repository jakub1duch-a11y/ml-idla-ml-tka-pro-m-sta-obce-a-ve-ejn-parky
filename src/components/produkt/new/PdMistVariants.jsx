import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NozzleControls from '@/components/produkt/nozzles/NozzleControls';
import NozzleResult from '@/components/produkt/nozzles/NozzleResult';
import NozzleVisual from '@/components/produkt/nozzles/NozzleVisual';
import { getNozzleModels, MRAK_MODELS, NOZZLE_TYPES, WATER_TARIFF } from '@/components/produkt/nozzles/nozzleData';
import '@/components/produkt/nozzles/nozzleConfigurator.css';

export default function PdMistVariants({ product }) {
  const [params] = useSearchParams();
  const isMrak = product.slug === 'mlzitko-mrak';
  const models = isMrak ? MRAK_MODELS : getNozzleModels(product.slug);
  const [modelId, setModelId] = useState('0');
  const model = models.find(m => m.id === (isMrak ? params.get('variant') || 'maly' : modelId)) || models[0];
  const [count, setCount] = useState(model?.count || '');
  const [type, setType] = useState('M2');
  const [pressure, setPressure] = useState(2);
  const [tariff, setTariff] = useState(WATER_TARIFF);
  const [direction, setDirection] = useState(null);
  useEffect(() => { setCount(model?.count || ''); setDirection(null); }, [product.slug, model?.id, model?.count]);
  const flow = NOZZLE_TYPES.find(n => n.id === type).flows[pressure];
  return <section id="varianty-mlhy" className="nozzle-config scroll-mt-24 border-y border-border bg-background px-5 py-14 sm:px-10 lg:py-20">
    <div className="mx-auto max-w-6xl">
      <p className="font-mono text-xs text-muted-foreground">OSAZENÍ A SPOTŘEBA · PODLE TABULEK MLŽIDLA</p>
      <h2 className="mt-3 mb-8 font-heading">Kolik vody spotřebuje {product.name}?</h2>
      <div className="grid gap-8 lg:grid-cols-2">
        <NozzleVisual product={product} model={model} direction={direction} onDirection={d => { setDirection(d); setCount(d.count); }} />
        <div className="min-w-0">
          {!isMrak && models.length > 1 && <label className="mb-5 block text-sm font-semibold">Katalogové provedení<select value={model.id} onChange={e => setModelId(e.target.value)}>{models.map(m => <option key={m.id} value={m.id}>{m.name} · {m.count} trysek</option>)}</select></label>}
          <p className="mb-2 font-semibold">{model ? `${model.concept ? 'Návrhové osazení' : 'Osazení dle katalogu'}: ${model.count} trysek · ${model.name}` : 'Standardní osazení tohoto provedení není v podkladech jednoznačně přiřazené.'}</p>
          <p className="mb-5 text-xs text-muted-foreground">{model?.note || 'Katalogy obsahují různá provedení. Vyberte konkrétní model; jiné počty a typy trysek jsou návrhem k technickému potvrzení.'} {model?.source}</p>
          <NozzleControls {...{ count, setCount, type, setType, pressure, setPressure, tariff, setTariff }} />
          <NozzleResult {...{ product, model, count, flow, tariff, type, pressure, direction }} />
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Zdroj průtoků: Mlžítko / Technické zajištění. Počty: Kalkulace mlžítka 2026 / Katalog produktů 2026. Podklady načtené 22. 10. 2026; změny tabulek se nepropíší automaticky. Výpočet není nabídkou ani potvrzením vhodnosti alternativního osazení.</p>
    </div>
  </section>;
}