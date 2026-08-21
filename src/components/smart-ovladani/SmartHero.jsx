import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import AutomationPreview from '@/components/smart-ovladani/AutomationPreview';

export default function SmartHero() {
  return <section className="relative overflow-hidden bg-primary pb-20 pt-28 sm:pt-32 lg:pb-28">
    <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-secondary/35 blur-3xl" />
    <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Smart Cooling · chytré městské ochlazování</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.02] tracking-[-.02em] text-primary-foreground sm:text-5xl lg:text-7xl">Řízené ochlazování veřejného prostoru. <span className="text-accent">Přesně tehdy, kdy je potřeba.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">Smart Cooling propojuje designové mlžítko, hydrauliku, senzory, chytré ventily, provozní scénáře a data do jednoho řešení pro města, parky, náměstí a sportoviště.</p><p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/50">Od jednoho ochlazovacího bodu po více samostatně řízených zón s přehledem o provozu a možností vzdálené správy.</p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-primary-foreground/80"><span className="flex items-center gap-2"><Check size={16} className="text-accent" /> Automatické scénáře</span><span className="flex items-center gap-2"><Check size={16} className="text-accent" /> Řízení více zón</span></div>
        <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"><Link to="/poptavka?produkt=Smart%20Cooling" className="btn-metallic-mist inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold">Navrhnout Smart Cooling <ArrowRight size={16} /></Link><a href="#jak-to-funguje" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">Jak to funguje</a></div>
      </motion.div>
      <div className="relative rounded-3xl border border-white/10 text-slate-900 shadow-2xl ring-1 ring-black/5"><motion.img initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp" alt="Ovládání mlžítka z mobilní aplikace" className="aspect-[4/3] w-full rounded-t-3xl bg-white object-contain p-2 opacity-95 sm:p-3" /><div className="relative z-10 mx-3 -mt-12 pb-4 sm:mx-10 sm:-mt-20 sm:pb-5"><AutomationPreview /></div></div>
    </div>
  </section>;
}