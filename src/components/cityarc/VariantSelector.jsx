import React from 'react';
import { Check } from 'lucide-react';
import { CITY_ARC_VARIANTS, formatPrice } from '@/lib/cityArcData';

export default function VariantSelector({ selected, onSelect }) {
  return <section><p className="text-sm font-semibold text-slate-950">Vyberte variantu</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{CITY_ARC_VARIANTS.map((variant) => <button key={variant.id} type="button" onClick={() => onSelect(variant.id)} className={`rounded-lg border p-4 text-left transition ${selected === variant.id ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500' : 'border-[#e5e5e5] bg-white hover:border-slate-400'}`}><div className="flex items-start justify-between"><span className="font-semibold text-slate-950">{variant.name}</span>{selected === variant.id && <Check size={16} className="text-sky-600" />}</div><p className="mt-3 text-xs leading-5 text-slate-500">{variant.nozzles} trysky<br />Výška {variant.height}</p><p className="mt-4 text-sm font-semibold text-slate-950">{formatPrice(variant.price)} Kč</p><p className="text-[11px] text-slate-400">bez DPH</p></button>)}</div></section>;
}