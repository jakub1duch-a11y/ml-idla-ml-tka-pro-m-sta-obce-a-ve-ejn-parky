import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ThermometerSnowflake } from 'lucide-react';
import { HERO_IMAGE, HERO_VIDEO } from '@/components/home/mistStoryData';

export default function MistCinematicHero() {
  return <section className="relative min-h-[720px] h-[100svh] overflow-hidden bg-slate-950 text-white">
    <img src={HERO_IMAGE} alt="Městský prostor ochlazený mlhou TeePe Mist" className="absolute inset-0 h-full w-full object-cover opacity-60" fetchPriority="high" />
    <video src={HERO_VIDEO} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen" />
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/35 to-slate-950" />
    <div className="mist-hero-glow" />
    <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 pt-32 lg:px-10 lg:pb-16">
      <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/40 bg-slate-950/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan backdrop-blur"><ThermometerSnowflake size={15} /> Nízkotlaké mlžení · 4 bar</p>
      <h1 className="max-w-4xl font-heading text-5xl font-medium leading-[0.96] tracking-tight text-white lg:text-7xl">Chladivý okamžik,<br /><span className="text-cyan">který oživí město.</span></h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">Objevte, jak jemná mlha promění rozpálený veřejný prostor v místo, kde se lidé chtějí zdržet.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/katalog" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan">Prohlédnout produkty <ArrowRight size={16} /></Link><Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Nezávazná poptávka</Link></div>
      <a href="#inspirace" className="mt-12 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/60 hover:text-white"><ArrowDown size={15} /> Prožít chlazení</a>
    </div>
  </section>;
}