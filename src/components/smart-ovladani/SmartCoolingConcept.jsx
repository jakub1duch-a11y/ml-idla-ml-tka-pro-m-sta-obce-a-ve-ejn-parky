import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, ArrowRight, CloudSun, Gauge, MapPinned, SlidersHorizontal, ThermometerSun } from 'lucide-react';

const PILLARS = [
  { icon: MapPinned, title: 'Místo', text: 'Navrhneme počet prvků, rozmístění a zóny podle reálného prostoru a pohybu lidí.', code: '// 01 LOKACE' },
  { icon: ThermometerSun, title: 'Podmínky', text: 'Teplota, čas a provozní režim určují, kdy má systém skutečně smysl spustit.', code: '// 02 PRAVIDLA' },
  { icon: SlidersHorizontal, title: 'Řízení', text: 'Ventily, časování a automatizační scénáře omezují zbytečný provoz a zjednodušují správu.', code: '// 03 LOGIKA' },
  { icon: Activity, title: 'Data', text: 'Spotřebu a provozní chování lze sledovat a využít pro servis i další optimalizaci.', code: '// 04 DATA' }
];

export default function SmartCoolingConcept() {
  const reduced = useReducedMotion();
  return (
    <section className="border-y border-slate-200 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[.18em] text-slate-500">
              <CloudSun size={14} className="text-accent" /> Smart Cooling
            </div>
            <h2 className="mt-6 max-w-2xl font-heading text-4xl leading-[1.02] tracking-[-.03em] text-slate-950 sm:text-5xl lg:text-6xl">
              Nejen mlžítko. Řízený ochlazovací bod pro veřejný prostor.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Smart Cooling spojuje designové mlžítko, hydrauliku, chytré řízení a provozní data do jednoho řešení. Cílem není nechat systém běžet déle, ale spouštět ho přesně tehdy a tam, kde přináší největší efekt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/poptavka"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Navrhnout Smart Cooling <ArrowRight size={15} />
              </Link>
              <Link
                to="/mestske-mlzitka"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary"
              >
                Vybrat městské mlžítko
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, text, code }, i) => (
              <motion.article
                key={title}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduced ? undefined : { y: -3 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-primary/40 lg:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-primary transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[.16em] text-slate-400">{code}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold tracking-[-.01em] text-slate-950">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{text}</p>
              </motion.article>
            ))}
            <motion.article
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="sm:col-span-2 rounded-2xl bg-secondary p-6 text-white lg:p-8"
            >
              <div className="flex items-center gap-3">
                <Gauge size={20} className="text-accent" />
                <p className="font-mono text-[11px] uppercase tracking-[.18em] text-white/50">Výstup projektu</p>
              </div>
              <p className="mt-4 max-w-3xl font-heading text-2xl font-semibold leading-[1.15] tracking-[-.01em] sm:text-3xl">
                Produkt + rozmístění + řízení + provozní scénář + servisní plán.
              </p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}