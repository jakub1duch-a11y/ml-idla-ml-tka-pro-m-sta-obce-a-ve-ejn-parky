import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import AutomationPreview from '@/components/smart-ovladani/AutomationPreview';

export default function SmartHero() {
  return <section className="relative overflow-hidden bg-primary pb-20 pt-32 lg:pb-28">
    <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-secondary/35 blur-3xl" />
    <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Smart mlžení · WiFi / aplikace</p>
        <h1 className="mt-5 font-heading text-5xl leading-[.98] text-primary-foreground sm:text-6xl lg:text-7xl">Komfort, který se <span className="text-accent">spustí sám.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/70">Aplikace propojí teplotu, počasí i pohyb lidí v prostoru. Každá zóna dostane přesně tolik mlhy, kolik právě potřebuje.</p>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-primary-foreground/80"><span className="flex items-center gap-2"><Check size={16} className="text-accent" /> Automatické scénáře</span><span className="flex items-center gap-2"><Check size={16} className="text-accent" /> Přehled spotřeby</span></div>
        <Link to="/kontakt?produkt=Smart%20ovl%C3%A1d%C3%A1n%C3%AD" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5">Poptat chytré řešení <ArrowRight size={16} /></Link>
      </motion.div>
      <div className="relative"><motion.img initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5c4b99749_Smartmlzitka-ovladanizmobilu.jpg" alt="Ovládání mlžítka z mobilní aplikace" className="aspect-[4/3] w-full rounded-3xl object-cover opacity-80" /><div className="relative mx-5 -mt-20 sm:mx-10"><AutomationPreview /></div></div>
    </div>
  </section>;
}