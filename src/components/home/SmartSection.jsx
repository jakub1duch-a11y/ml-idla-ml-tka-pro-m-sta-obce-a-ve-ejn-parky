import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Clock, Layers, Droplets, ArrowRight } from 'lucide-react';
import SmartControlVisual from '@/components/home/SmartControlVisual';

const features = [
{ icon: Wifi, label: 'Ovládání přes Wi‑Fi / aplikaci', sub: 'Přístup odkudkoli podle nastavení projektu' },
{ icon: Clock, label: 'Automatické plány', sub: 'Podle času i teploty' },
{ icon: Layers, label: 'Zóny a provozní režimy', sub: 'Každé mlžítko nebo skupina samostatně' },
{ icon: Droplets, label: 'Přehled průtoku vody', sub: 'Kontrola spotřeby v reálných číslech' }];


export default function SmartSection() {
  return (
    <section id="smart-misteni" className="smart-scroll-trigger overflow-hidden border-y border-border bg-[hsl(var(--accent-foreground))] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="smart-scroll-progress" aria-hidden="true"><span /></div>
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}> 
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/20 text-xs font-mono tracking-widest uppercase mb-6 text-[hsl(var(--card))]">
              Smart řízení · Wi‑Fi / aplikace
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mb-6 font-heading text-[clamp(2rem,8vw,2.6rem)] leading-[1.08] tracking-[-0.035em] text-[hsl(var(--popover-foreground))] lg:text-4xl">
              Chytré řízení, které spouští mlžení jen tehdy, kdy dává smysl
            </motion.h2>
            

            

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((f, i) =>
              <motion.div key={f.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-[hsl(var(--card))]">
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.1, duration: 0.4, ease: 'backOut' }}>
                    <f.icon size={18} className="mt-0.5 flex-shrink-0 text-[hsl(var(--background))]" />
                  </motion.div>
                  <div>
                    <p className="text-base font-semibold leading-tight text-[hsl(var(--card))] [font-family:'Plus_Jakarta_Sans',_sans-serif] sm:text-lg">{f.label}</p>
                    <p className="text-xs text-[#dedede]">{f.sub}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/kalkulacka" className="btn-metallic-mist inline-flex min-h-12 w-full items-center justify-center px-6 py-3.5 text-center text-sm font-bold sm:w-auto sm:px-7">
                Spočítat orientační provoz <ArrowRight size={16} />
              </Link>
              <Link to="/smart-ovladani" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--card))] px-6 py-3.5 text-center text-sm font-bold text-[hsl(var(--foreground))] transition hover:bg-white/90 hover:text-foreground sm:w-auto">Jak funguje smart řízení

              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24, scale: 0.97 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}><SmartControlVisual /></motion.div>
        </div>
      </div>
    </section>);

}