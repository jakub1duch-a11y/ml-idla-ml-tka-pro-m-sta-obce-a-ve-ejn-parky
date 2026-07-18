import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Gauge, Sparkles, ThermometerSnowflake, Zap } from 'lucide-react';

const METRICS = [
  { icon: Droplets, label: 'Spotřeba vody', value: 'optimalizovaná', width: '40%' },
  { icon: ThermometerSnowflake, label: 'Účinnost chlazení', value: 'až −12 °C', width: '92%' },
  { icon: Gauge, label: 'Provozní tlak', value: '3–8 bar', width: '64%' },
  { icon: Zap, label: 'Výkon systému', value: 'dle konfigurace', width: '74%' },
  { icon: Sparkles, label: 'Velikost kapének', value: '5–15 μm', width: '28%' },
];

export default function MistPerformanceSection() {
  return <section className="bg-slate-950 py-20 text-white lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Technická jistota</p><h2 className="mt-4 max-w-2xl font-heading text-4xl font-medium tracking-tight lg:text-5xl">Výkon, který je vidět i cítit.</h2><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{METRICS.map((metric, index) => <motion.article key={metric.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur"><metric.icon size={34} className="text-cyan" /><p className="mt-7 text-sm text-white/65">{metric.label}</p><p className="mt-1 font-heading text-2xl font-semibold">{metric.value}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: metric.width }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.25, delay: index * 0.1, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-cyan to-white" /></div></motion.article>)}</div></div></section>;
}