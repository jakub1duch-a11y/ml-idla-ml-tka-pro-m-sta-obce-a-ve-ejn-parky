import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Building2, Droplets, Gauge, MapPinned, School, Trophy, Trees } from 'lucide-react';

const USE_CASES = [
  { icon: Building2, title: 'Náměstí a pěší zóny', text: 'Lokální ochlazovací body v místech s vysokou koncentrací lidí, doplněné o časový a teplotní režim.' },
  { icon: Trees, title: 'Parky a promenády', text: 'Více samostatných zón s rozdílným režimem podle návštěvnosti a denní doby.' },
  { icon: School, title: 'Školy a hřiště', text: 'Provoz v jasně definovaných časových oknech a s možností manuálního spuštění obsluhou.' },
  { icon: Trophy, title: 'Sportoviště', text: 'Krátké ochlazovací cykly podle teploty, času a provozu areálu.' }
];

const METRICS = [
  { icon: Activity, label: 'Provozní režim', value: 'AUTO / MANUAL', note: 'podle projektu' },
  { icon: Gauge, label: 'Počet zón', value: '1–N', note: 'samostatně řízené větve' },
  { icon: Droplets, label: 'Voda', value: 'dle trysek', note: 'počítaná spotřeba projektu' },
  { icon: MapPinned, label: 'Rozmístění', value: 'na míru', note: 'podle prostoru a pohybu lidí' }
];

export default function SmartCoolingCityUseCases() {
  return (
    <section className="bg-slate-950 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Smart city use cases</p>
            <h2 className="mt-4 font-heading text-4xl leading-[1.05] tracking-[-.03em] sm:text-5xl">Ochlazování jako řízená městská infrastruktura.</h2>
            <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">Smart Cooling není jeden univerzální box. Každý projekt vzniká z konkrétního prostoru, počtu lidí, provozních hodin, typu mlžítka a dostupné infrastruktury.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{METRICS.map(({ icon: Icon, label, value, note }) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.05] p-5"><Icon size={20} className="text-accent" /><p className="mt-5 font-mono text-[10px] uppercase tracking-[.16em] text-white/40">{label}</p><p className="mt-1 font-heading text-2xl">{value}</p><p className="mt-1 text-xs text-white/45">{note}</p></div>)}</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">{USE_CASES.map(({ icon: Icon, title, text }, i) => <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} className="rounded-3xl border border-white/10 bg-white/[.05] p-6 sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[.06]"><Icon size={20} className="text-accent" /></div><h3 className="mt-6 font-heading text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{text}</p></motion.article>)}</div>
        </div>
      </div>
    </section>
  );
}
