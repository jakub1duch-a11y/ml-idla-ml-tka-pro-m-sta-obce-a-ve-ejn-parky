import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ff03dd7df_export-1775421627756png.jpg';

export default function ProductLaunchPromo() {
  return <section className="my-12 overflow-hidden rounded-3xl bg-slate-950 text-white">
    <div className="grid md:grid-cols-2">
      <div className="relative min-h-64 overflow-hidden"><img src={IMAGE} alt="Zahradní mlžítko BENDY_60 v parku" loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/60" /></div>
      <div className="flex flex-col justify-center p-7 lg:p-9"><span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-slate-950"><Sparkles size={12} /> Novinka léta 2026</span><h2 className="m-0 font-heading text-3xl font-light leading-tight text-white">BENDY_60 pro zahrady a veřejný prostor.</h2><p className="mt-4 text-sm leading-relaxed text-white/65">Elegantní mlžítko pro cesty, terasy, parky i odpočinkové zóny. Jemná mlha přináší okamžité osvěžení bez mokrého efektu.</p><Link to="/blog/novinka-leta-2026-bendy-60" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan hover:text-white">Poznat BENDY_60 <ArrowRight size={15} /></Link></div>
    </div>
  </section>;
}