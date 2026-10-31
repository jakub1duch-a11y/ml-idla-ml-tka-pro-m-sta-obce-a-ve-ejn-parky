import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MRAK_VARIANTS } from '@/lib/productDetailConfig';

export default function PdMrakSizeSelector() {
  const [params, setParams] = useSearchParams();
  const active = params.get('variant') === 'velky' ? 'velky' : 'maly';
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-7 lg:px-10">
      <h2 className="font-heading text-2xl text-foreground">Velikost a provedení MRAKU</h2>
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        {MRAK_VARIANTS.map((variant) => (
          <button key={variant.id} type="button" aria-pressed={active === variant.id}
            onClick={() => { const next = new URLSearchParams(params); next.set('variant', variant.id); setParams(next, { replace: true, preventScrollReset: true }); }}
            className={`min-h-12 min-w-0 break-words rounded-2xl border p-5 text-left ${active === variant.id ? 'border-primary bg-muted' : 'border-border bg-card'}`}>
            <span className="block font-heading text-xl font-semibold text-primary">{variant.name} · {variant.height}</span>
            <span className="mt-2 block text-base text-muted-foreground">{variant.description}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{MRAK_VARIANTS.find((variant) => variant.id === active)?.note} Konečný rozměr a konfiguraci potvrzujeme před naceněním.</p>
    </div>
  );
}