import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Leaf, ShieldCheck, ThermometerSnowflake } from 'lucide-react';

export const QUICK_BENEFITS = [
  { icon: Droplets, value: 'Nízká spotřeba vody', text: 'Jemné mlžení pro každodenní provoz.', animation: { y: [0, 8, 0], scale: [1, 0.9, 1] } },
  { icon: ThermometerSnowflake, value: 'Ochlazení až o 12 °C', text: 'Okamžitá úleva v rozpáleném prostoru.', animation: { y: [0, 5, 0], rotate: [0, -4, 0] } },
  { icon: Leaf, value: 'Ekologický provoz', text: 'Osvěžení s respektem k okolí.', animation: { rotate: [0, 8, -5, 0], y: [0, -3, 0] } },
  { icon: ShieldCheck, value: 'Česká výroba a servis', text: 'Návrh, výroba i péče z jednoho místa.', animation: { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] } },
];

export default function QuickBenefits({ className = '', compact = false }) {
  return <div className={`grid gap-3 ${className}`}>{QUICK_BENEFITS.map((benefit) => <motion.article key={benefit.value} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`rounded-3xl border border-white/25 bg-white/10 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl ${compact ? 'flex items-center gap-4' : ''}`}><motion.div animate={benefit.animation} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-cyan shadow-inner shadow-white/10"><benefit.icon size={compact ? 46 : 82} strokeWidth={1.5} /></motion.div><div className={compact ? '' : 'mt-5'}><h3 className="font-heading text-xl font-semibold text-white">{benefit.value}</h3><p className="mt-1 text-sm leading-relaxed text-white/70">{benefit.text}</p></div></motion.article>)}</div>;
}