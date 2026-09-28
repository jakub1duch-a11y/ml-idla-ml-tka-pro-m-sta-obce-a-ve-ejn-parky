import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Smartphone, CalendarClock, Droplets, BarChart3, Bell, Layers } from 'lucide-react';

const BENEFITS = [
  { icon: Smartphone, title: 'Vzdálené ovládání', desc: 'U podporované konfigurace můžete mlžení ovládat a plánovat také vzdáleně.', code: '// VZDÁLENĚ' },
  { icon: CalendarClock, title: 'Automatické scénáře', desc: 'Nastavte scénáře podle času, teploty a podle konfigurace dalších senzorů.', code: '// SCÉNÁŘE' },
  { icon: Droplets, title: 'Efektivní využití vody', desc: 'Mlžení běží jen tehdy, kdy má podle nastavených podmínek skutečně smysl.', code: '// ÚSPORA VODY' },
  { icon: BarChart3, title: 'Provozní přehled', desc: 'Podle konfigurace lze sledovat stav systému, zón a provozních scénářů.', code: '// PŘEHLED' },
  { icon: Bell, title: 'Stavová upozornění', desc: 'U podporované konfigurace lze doplnit vzdálená stavová upozornění a diagnostiku.', code: '// ALERTS' },
  { icon: Layers, title: 'Více zařízení najednou', desc: 'Více mlžítek lze podle návrhu rozdělit do samostatně řízených zón.', code: '// MULTI-ZÓNA' }
];

export default function SmartBenefits() {
  const reduced = useReducedMotion();
  return (
    <section className="border-y border-slate-200 bg-slate-50/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[.22em] text-slate-400">Výhody smart řízení</p>
          <h2 className="mt-4 font-heading text-3xl leading-[1.05] tracking-[-.025em] text-slate-950 sm:text-4xl lg:text-[2.75rem]">
            Kontrola nad provozem bez každodenní obsluhy.
          </h2>
          <div className="mt-6 h-px w-16 bg-accent" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <motion.article
              key={b.title}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduced ? undefined : { y: -4 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-primary/40 lg:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-primary transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                <b.icon size={24} strokeWidth={1.6} />
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[.16em] text-slate-400">{b.code}</p>
              <h3 className="mt-2 font-heading text-xl font-semibold tracking-[-.01em] text-slate-950">{b.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{b.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}