import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Thermometer, Timer, Waves } from 'lucide-react';

const STEPS = [
  { Icon: Thermometer, number: '01', title: 'Senzor vyhodnotí teplotu', text: 'Překročí-li teplota váš limit, systém připraví zónu.' },
  { Icon: CloudSun, number: '02', title: 'Ověří počasí a prostor', text: 'Zohlední déšť, vítr, čas i pohyb lidí v místě.' },
  { Icon: Timer, number: '03', title: 'Spustí správný scénář', text: 'Mlha běží jen po dobu, která přináší skutečný komfort.' },
  { Icon: Waves, number: '04', title: 'Sleduje provoz a úspory', text: 'V aplikaci máte přehled o každém cyklu a spotřebě.' }
];

export default function SmartAutomationFlow() {
  return <section className="bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="max-w-2xl"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Automatizace v praxi</p><h2 className="mt-4 font-heading text-4xl text-foreground lg:text-5xl">Chytré mlžení pracuje samo.</h2><p className="mt-4 text-muted-foreground">Od první změny počasí až po přesně dávkovanou mlhu. Bez zbytečného provozu a bez hlídání ručního ovladače.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{STEPS.map(({ Icon, number, title, text }, index) => <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border-t-2 border-secondary pt-5"><Icon size={34} className="text-secondary" /><p className="mt-8 font-mono text-xs text-muted-foreground">{number}</p><h3 className="mt-2 font-heading text-xl text-foreground">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></motion.div>)}</div></div></section>;
}