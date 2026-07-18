import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ThermometerSnowflake } from 'lucide-react';

const VARIANTS = [
  { label: 'GATE70-U', detail: 'Rovná' },
  { label: 'GATE70-V', detail: 'Lomený oblouk' },
];

const SPECS = [
  ['Tlak', '2–8 bar'],
  ['Spotřeba', '15–25 l/h'],
];

export default function Gate70ProductCard() {
  return (
    <Link to="/gate70" className="group relative block min-h-full overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png" alt="Mlžná brána GATE70" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/10" />
      <div className="relative flex min-h-[18.6rem] flex-col justify-end p-5 text-white">
        <div className="mb-auto flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[10px] font-mono tracking-widest uppercase backdrop-blur-sm">Mlžná brána</span>
          <span className="flex items-center gap-1 text-xs font-semibold"><ThermometerSnowflake size={14} /> až −10 °C</span>
        </div>
        <p className="text-xs font-mono tracking-[0.18em] text-white/60 uppercase">Architektonický prvek</p>
        <h3 className="mt-1 font-heading text-3xl font-semibold tracking-tight">GATE70</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">Nerezová mlžná brána pro náměstí, parky a vstupy do veřejných prostor.</p>
        <dl className="mt-4 grid grid-cols-2 gap-2">
          {SPECS.map(([label, value]) => <div key={label} className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-2 backdrop-blur-sm"><dt className="text-[9px] font-medium uppercase tracking-wide text-white/60">{label}</dt><dd className="mt-0.5 text-xs font-bold">{value}</dd></div>)}
        </dl>
        <div className="mt-2 flex gap-3 text-[10px] text-white/65">{VARIANTS.map((variant) => <span key={variant.label}><b className="text-white">{variant.label}</b> · {variant.detail}</span>)}</div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold">Zobrazit varianty <ArrowRight size={14} /></span>
      </div>
    </Link>
  );
}