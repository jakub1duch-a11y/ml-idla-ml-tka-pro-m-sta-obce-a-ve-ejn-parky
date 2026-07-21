import React from 'react';
import { Activity, ArrowRight, Droplets, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

function PhoneDiagram() {
  return <div className="relative h-36 w-20 shrink-0 rounded-[1.1rem] border-2 border-cyan/60 bg-slate-950 p-2 shadow-[0_0_24px_rgba(34,211,238,.2)]"><div className="mx-auto h-1 w-7 rounded-full bg-white/20" /><div className="mt-3 space-y-2 bg-[hsl(var(--card))]"><div className="rounded bg-cyan/15 p-2 text-center"><Droplets size={15} className="mx-auto text-cyan" /><span className="mt-1 block text-[hsl(var(--popover-foreground))] uppercase text-base">ZÓNA 01</span></div><div className="grid grid-cols-2 gap-1"><span className="h-5 rounded text-[hsl(var(--card))] bg-[hsl(var(--primary))]" /><span className="h-5 rounded text-[hsl(var(--popover))] bg-[hsl(var(--card-foreground))]" /></div><div className="h-1.5 rounded bg-cyan/40" /><div className="h-1.5 w-2/3 rounded bg-white/15" /></div></div>;
}

function TubeDiagram() {
  return <div className="relative flex h-36 w-24 shrink-0 items-center justify-center text-[hsl(var(--card-foreground))]"><div className="h-28 w-12 rounded-full border-[7px] border-slate-300 bg-slate-700 shadow-[inset_0_0_0_1px_rgba(255,255,255,.4)]" /><span className="absolute right-0 top-6 text-[8px] font-bold text-[hsl(var(--foreground))]">AISI 316L</span><span className="absolute right-0 bottom-6 text-[8px] font-bold text-[hsl(var(--popover-foreground))]">Ø 60–76</span></div>;
}

export default function GateActivePreview({ item, active }) {
  const isApp = active === 0;const isMaterial = active === 4;
  return <div className="flex min-h-44 items-center gap-5 border-t border-white/10 p-5 bg-[#09ccd3]">
    {isApp ? <PhoneDiagram /> : isMaterial ? <TubeDiagram /> : <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-cyan/30"><Activity size={34} className="text-[hsl(var(--card-foreground))] size-20" /></div>}
    <div className="flex-1"><p className="font-bold uppercase tracking-[.18em] text-[hsl(var(--popover-foreground))] text-xs">AKTIVNÍ PRVEK</p><h3 className="mt-2 font-semibold text-2xl text-[hsl(var(--input))] normal-case text-left">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--popover-foreground))]">{item.detail}</p><div className="mt-4 flex flex-wrap items-center gap-4"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--popover-foreground))]">PROPOJENO S GATE</span>{isApp && <Link to="/aplikace-ovladani-mlzitek" className="inline-flex items-center gap-1 text-xs font-bold text-cyan">Aplikace a návod <ArrowRight size={12} /></Link>}<Link to="/produkt/gate-60-76" className="inline-flex items-center gap-1 font-bold text-white text-sm">Detail GATE</Link><Link to="/poptavka?produkt=Mlžná%20brána%20GATE" className="inline-flex items-center gap-1 font-bold text-white text-sm text-right">Poptat řešení</Link></div></div>
  </div>;
}