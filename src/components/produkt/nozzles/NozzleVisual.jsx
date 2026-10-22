import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GATE_DIRECTIONS } from '@/components/produkt/nozzles/nozzleData';

export default function NozzleVisual({ product, model, direction, onDirection }) {
  const image = direction?.image || model?.image || product.image_url;
  return <div className="min-w-0">
    {image && <Dialog><DialogTrigger asChild><button type="button" className="block w-full border border-border bg-card" aria-label="Zvětšit náhled osazení">
      <img src={image} alt={`${product.name} · ${direction?.name || model?.name || 'produktový náhled'}`} width="1024" height="1024" loading="lazy" className="aspect-square w-full object-contain" />
    </button></DialogTrigger><DialogContent className="max-w-4xl"><DialogTitle>{product.name} · ilustrační náhled</DialogTitle><img src={image} alt="Zvětšený náhled produktu" className="max-h-[75vh] w-full object-contain" /></DialogContent></Dialog>}
    {product.slug === 'mlzna-brana-gate' && <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">{GATE_DIRECTIONS.map(item => <button key={item.id} type="button" onClick={() => onDirection(item)} aria-pressed={direction?.id === item.id} className="nozzle-selection p-2 text-left">
      <img src={item.image} alt={`AI návrh GATE: ${item.name}`} width="300" height="300" loading="lazy" className="aspect-square w-full object-contain" />
      <span className="mt-2 block text-sm font-semibold">{item.name}</span><span className="block text-xs">Návrh {item.count} trysek{direction?.id === item.id ? ' · Vybráno' : ''}</span>
    </button>)}</div>}
    <p className="mt-3 text-xs text-muted-foreground">{direction ? `AI vizualizace směru mlžení s návrhem ${direction.count} trysek, nikoli výrobní fotografie. Změna počtu ve výpočtu nepřekresluje obrázek; rozmístění a proveditelnost musí potvrdit výrobce.` : 'Náhled ukazuje vzhled produktu. Počet trysek ve výpočtu vychází z vybraného katalogového provedení nebo z vašeho zadání, nikoli z automatického rozpoznávání obrázku.'}</p>
  </div>;
}