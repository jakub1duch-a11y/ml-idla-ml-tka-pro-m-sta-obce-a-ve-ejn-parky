import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Cloud, Cog, Droplets, Leaf, PencilRuler, ShieldCheck, ThermometerSnowflake, Truck, Utensils, Waves, Wind, Wrench } from 'lucide-react';

export const QUICK_BENEFITS = [
  { icon: Droplets, value: 'Nízká spotřeba vody', text: 'Kapka v pravidelném rytmu naplní a uvolní svůj objem.', animation: { y: [0, 9, 0], scaleY: [1, 0.72, 1] } },
  { icon: ThermometerSnowflake, value: 'Ochlazení až o 12 °C', text: 'Chladivá aura zvýrazňuje okamžitou úlevu v horku.', animation: { y: [-4, 8, -4], rotate: [0, -5, 0] }, aura: true },
  { icon: Leaf, value: 'Ekologický provoz', text: 'List se jemně pohybuje jako ve svěžím letním vánku.', animation: { rotate: [0, 9, -6, 0], y: [0, -4, 0] } },
  { icon: Cloud, value: 'Mikromlha', text: 'Z trysky pulzuje lehký oblak jemného osvěžení.', animation: { scale: [0.88, 1.12, 0.88], x: [-3, 4, -3], opacity: [0.6, 1, 0.6] } },
  { icon: Cog, value: 'Nerezová konstrukce', text: 'Precizní komponenty navržené pro dlouhodobý provoz.', animation: { rotate: 360 }, duration: 9 },
  { icon: ShieldCheck, value: 'Bezpečný provoz', text: 'Světelný štít potvrzuje promyšlené řešení pro veřejný prostor.', animation: { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }, aura: true },
  { icon: Wrench, value: 'Servis a údržba', text: 'Dostupná péče pro spolehlivý provoz v každé sezóně.', animation: { rotate: [0, 22, 0] } },
  { icon: Truck, value: 'Montáž po celé ČR', text: 'Dodávka se krátce vydá po trase k nové realizaci.', animation: { x: [-5, 9, -5] } },
  { icon: Building2, value: 'Pro města a obce', text: 'Veřejný prostor dostává novou vrstvu letního komfortu.', animation: { pathLength: [0.55, 1, 0.55], opacity: [0.55, 1, 0.55] } },
  { icon: Utensils, value: 'Restaurace a terasy', text: 'Slunečný prostor se mění v příjemnou chladivou zónu.', animation: { y: [0, -5, 0], rotate: [0, 4, 0] } },
  { icon: PencilRuler, value: 'Zakázková výroba', text: 'Návrh se postupně promění v přesné řešení na míru.', animation: { rotate: [-8, 8, -8], x: [-3, 3, -3] } },
  { icon: Wind, value: 'Okamžité osvěžení', text: 'Proud jemných částic se rozšíří do okolního prostoru.', animation: { x: [-7, 9, -7], opacity: [0.45, 1, 0.45] } },
];

export default function QuickBenefits({ className = '', compact = false, limit }) {
  const benefits = limit ? QUICK_BENEFITS.slice(0, limit) : QUICK_BENEFITS;
  return <div className={`grid gap-x-8 gap-y-7 ${className}`}>{benefits.map((benefit, index) => <motion.article key={benefit.value} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ x: 4 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }} className={compact ? 'flex items-center gap-4 text-white' : 'rounded-3xl border border-white/25 bg-white/10 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl'}><div className={compact ? 'relative flex h-12 w-12 shrink-0 items-center justify-center text-cyan drop-shadow-[0_0_16px_rgba(103,232,249,.8)]' : 'relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-cyan shadow-inner shadow-white/10'}>{benefit.aura && <motion.span animate={{ scale: [0.75, 1.2, 0.75], opacity: [0.15, 0.6, 0.15] }} transition={{ duration: 3, repeat: Infinity }} className={compact ? 'absolute inset-0 rounded-full bg-cyan blur-xl' : 'absolute inset-1 rounded-xl bg-cyan blur-xl'} />}<motion.div animate={benefit.animation} transition={{ duration: benefit.duration || 3.4, repeat: Infinity, ease: 'easeInOut' }} className="relative"><benefit.icon size={compact ? 38 : 82} strokeWidth={1.5} /></motion.div></div><div className={compact ? '' : 'mt-5'}><h3 className={`font-heading font-semibold text-white ${compact ? 'text-base' : 'text-xl'}`}>{benefit.value}</h3><p className={`mt-1 text-sm leading-relaxed text-white/70 ${compact ? 'hidden' : ''}`}>{benefit.text}</p></div></motion.article>)}</div>;
}