import React from 'react';
import { motion } from 'framer-motion';

const MILESTONES = [
  ['2003', 'Základy přesné výroby', 'Budujeme know-how v práci s nerezovými komponenty a tvarováním trubek.'],
  ['2014', 'Rozvoj zakázkových řešení', 'Rozšiřujeme výrobu o technicky náročné projekty na míru.'],
  ['2020', 'Vznik Mlžidla.cz', 'Přenášíme zkušenost z chlazení do veřejného prostoru.'],
  ['Dnes', 'Mlžné sochy pro města', 'Navrhujeme, vyrábíme, instalujeme a servisujeme projekty napříč Českem.'],
];

export default function CompanyTimeline() {
  return <section className="overflow-hidden bg-slate-950 py-20 text-white lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Časová osa</p><h2 className="mt-4 max-w-2xl font-heading text-4xl font-medium tracking-tight lg:text-5xl">Z výroby pro průmysl<br />k ochlazování měst.</h2><div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{MILESTONES.map(([year, title, text], index) => <motion.article key={year} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ delay: index * 0.1 }} className="relative border-t border-white/20 pt-6"><span className="absolute -top-1.5 h-3 w-3 rounded-full bg-cyan shadow-[0_0_18px_rgba(34,211,238,.9)]" /><p className="font-heading text-3xl font-semibold text-cyan">{year}</p><h3 className="mt-5 font-heading text-xl font-medium">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/65">{text}</p></motion.article>)}</div></div></section>;
}