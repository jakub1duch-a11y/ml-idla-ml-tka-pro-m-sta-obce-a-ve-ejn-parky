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
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Smart řízení mlžného systému</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.02] tracking-[-.02em] text-primary-foreground sm:text-5xl lg:text-7xl">Mlžení přesně tehdy, <span className="text-accent">kdy je potřeba.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">Smart řízení propojí časový režim, teplotu a podle konfigurace další senzory. Jednotlivé zóny se spouštějí jen při splnění nastavených provozních podmínek.</p>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-primary-foreground/80"><span className="flex items-center gap-2"><Check size={16} className="text-accent" /> Automatické scénáře</span><span className="flex items-center gap-2"><Check size={16} className="text-accent" /> Řízení více zón</span></div>
        <div className="mt-8 flex flex-wrap items-center gap-4"><Link to="/kontakt?produkt=Smart%20ovl%C3%A1d%C3%A1n%C3%AD" className="btn-metallic-mist inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold">Poptat chytré řešení <ArrowRight size={16} /></Link><a href="#jak-to-funguje" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">Jak to funguje</a></div>
      </motion.div>
      <div className="relative"><motion.img initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5c4b99749_Smartmlzitka-ovladanizmobilu.jpg" alt="Ovládání mlžítka z mobilní aplikace" className="aspect-[4/3] w-full rounded-3xl bg-white object-contain opacity-95" /><div className="relative mx-3 -mt-12 sm:mx-10 sm:-mt-20"><AutomationPreview /></div></div>
    </div>
  </section>;
}