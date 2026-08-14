import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';
import { setSEO } from '@/lib/seo';

const TRUST = [
  { icon: Droplets, title: 'Reálné průtoky', text: 'Výpočet vychází z parametrů aktivních produktů MLŽIDLA.cz.' },
  { icon: Gauge, title: 'Vodovodní řad', text: 'Počítáme s běžným provozem bez vysokotlakého čerpadla.' },
  { icon: ShieldCheck, title: 'Orientační kalkulace', text: 'Výsledek slouží jako rychlý podklad pro návrh a porovnání variant.' },
];

export default function Kalkulacka() {
  useEffect(() => {
    setSEO({
      title: 'Kalkulátor provozních nákladů mlžítek | MLŽIDLA.cz',
      description: 'Spočítejte si orientační spotřebu vody a měsíční provozní náklady aktivních mlžítek a mlžných bran MLŽIDLA.cz.',
      canonicalPath: '/kalkulacka',
    });
  }, []);

  return <main className="min-h-screen bg-background">
    <section className="relative overflow-hidden bg-primary pb-16 pt-32 text-primary-foreground lg:pb-20 lg:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(43,191,207,.18),transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Kalkulátor provozních nákladů</motion.p>
        <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.05}} className="mt-5 max-w-4xl font-heading text-4xl leading-[1.02] tracking-[-.02em] sm:text-5xl lg:text-7xl">Spočítejte si provoz mlžítka ještě před realizací.</motion.h1>
        <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">Vyberte konkrétní produkt, nastavte dobu provozu a okamžitě uvidíte orientační spotřebu vody i měsíční náklad. Bez zbytečných technických údajů.</motion.p>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <div className="grid gap-4 md:grid-cols-3">
        {TRUST.map(({icon:Icon,title,text}) => <div key={title} className="rounded-2xl border border-border bg-card p-6"><Icon size={20} className="text-secondary"/><h2 className="mt-5 font-heading text-xl text-foreground">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}
      </div>

      <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mt-10">
        <MlzeniKalkulator />
      </motion.div>
    </section>

    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-16">
        <div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Potřebujete přesnější návrh?</p><h2 className="mt-4 max-w-3xl font-heading text-3xl text-foreground lg:text-4xl">Připravíme kalkulaci pro konkrétní prostor, provoz a počet mlžítek.</h2><p className="mt-4 max-w-2xl text-muted-foreground">Stačí poslat fotografii, rozměry nebo situační plán. Doporučíme vhodný model a způsob řízení.</p></div>
        <div className="flex flex-wrap gap-3"><Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">Poptat projekt <ArrowRight size={16}/></Link><Link to="/smart-ovladani" className="btn-secondary-outline px-7 py-3.5 text-sm font-semibold text-foreground">Chytré ovládání</Link></div>
      </div>
    </section>
  </main>;
}
