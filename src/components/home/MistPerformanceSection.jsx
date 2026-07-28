import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Gauge, Sparkles, ThermometerSnowflake, Zap } from 'lucide-react';

const METRICS = [
{ icon: Droplets, label: 'Spotřeba vody', value: 'úsporný provoz', width: '40%' },
{ icon: ThermometerSnowflake, label: 'Ochlazení prostoru', value: 'až −12 °C', width: '92%' },
{ icon: Gauge, label: 'Nízkotlaký provoz', value: '2–8 bar (200–800 kPa)', width: '64%' },
{ icon: Zap, label: 'Řízení mlžení', value: 'na míru provozu', width: '74%' },
{ icon: Sparkles, label: 'Velikost kapének', value: "50\u2013100 \u03BCm", width: '28%' }];


export default function MistPerformanceSection() {
  return <section id="benefity" className="text-white lg:py-28 py-20 bg-slate-950"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Technologie nízkotlakého mlžení</p><h2 className="mt-4 max-w-2xl font-heading text-4xl font-medium tracking-tight lg:text-5xl">Účinné ochlazení pro města, terasy a veřejný prostor.</h2><div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">{METRICS.map((metric, index) => <motion.article key={metric.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.06 }} className="group"><div className="text-cyan"><metric.icon size={34} strokeWidth={1.5} /></div><p className="mt-5 text-sm text-white/65">{metric.label}</p><p className="mt-1 font-heading font-semibold text-lg">{metric.value}</p><div className="mt-4 h-px w-full bg-white/15"><motion.div initial={{ width: 0 }} whileInView={{ width: metric.width }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1, delay: index * 0.08, ease: 'easeOut' }} className="h-px bg-cyan" /></div></motion.article>)}</div></div></section>;
}