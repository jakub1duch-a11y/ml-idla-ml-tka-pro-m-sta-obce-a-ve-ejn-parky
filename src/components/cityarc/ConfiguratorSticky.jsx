import React from 'react';
import { Send } from 'lucide-react';
import { formatPrice } from '@/lib/cityArcData';

export default function ConfiguratorSticky({ visible, variant, total, onOpen }) {
  return <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e5e5] bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><div><p className="text-xs text-slate-500">Vybraná konfigurace</p><p className="text-sm font-semibold text-slate-950">{variant.name}</p></div><div className="text-right"><p className="text-sm font-semibold text-slate-950">{formatPrice(total)} Kč <span className="font-normal text-slate-500">bez DPH</span></p><p className="text-xs text-slate-500">{formatPrice(Math.round(total * 1.21))} Kč s DPH</p></div><button type="button" onClick={onOpen} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-slate-800"><Send size={14} /> Odeslat poptávku</button></div></div>;
}