import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Gauge, Sparkles, ThermometerSnowflake, Zap } from 'lucide-react';

const METRICS = [
  { icon: Droplets, label: 'Spotřeba vody', value: 'úsporný provoz', width: '40%' },
  { icon: ThermometerSnowflake, label: 'Ochlazení prostoru', value: 'až −12 °C', width: '92%' },
  { icon: Gauge, label: 'Vysokotlaký systém', value: 'pro jemnou mlhu', width: '64%' },
  { icon: Zap, label: 'Řízení mlžení', value: 'na míru provozu', width: '74%' },
  { icon: Sparkles, label: 'Velikost kapének', value: '5–15 μm', width: '28%' },
];

export default function MistPerformanceSection() {
  return <section id="benefity" className="bg-slate-950 py-20 text-white lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Technologie vysokotlakého mlžení</p><h2 className="mt-4 max-w-2xl font-heading text-4xl font-medium tracking-tight lg:text-5xl">Účinné ochlazení pro města, terasy a veřejný prostor.</h2><div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">{METRICS.map((metric, index) => <motion.article key={metric.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} className="group"><motion.div animate={{ y: [0, -5, 0], rotate: index % 2 ? [0, 4, 0] : [0, -4, 0] }} transition={{ duration: 3.4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }} className="text-cyan drop-shadow-[0_0_16px_rgba(103,232,249,.72)]"><metric.icon size={38} strokeWidth={1.5} /></motion.div><p className="mt-5 text-sm text-white/65">{metric.label}</p><p className="mt-1 font-heading text-2xl font-semibold">{metric.value}</p><div className="mt-4 h-px w-full bg-white/15"><motion.div initial={{ width: 0 }} whileInView={{ width: metric.width }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.25, delay: index * 0.1, ease: 'easeOut' }} className="h-px bg-cyan" /></div></motion.article>)}</div></div></section>;
}