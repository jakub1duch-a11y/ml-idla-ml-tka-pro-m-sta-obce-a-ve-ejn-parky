import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, ThermometerSun } from 'lucide-react';

export default function HeatStoryIntro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const heatOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.35, 1, 0.08]);
  const coolOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 0.72]);
  const temperature = useTransform(scrollYProgress, [0.35, 1], ['47 °C', '29 °C']);
  return <div ref={ref} className="relative min-h-[74svh] overflow-hidden border-y border-orange-300/15 bg-slate-950 text-white">
    <motion.div style={{ opacity: heatOpacity }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(249,115,22,.62),transparent_38%),linear-gradient(120deg,#431407,#7f1d1d_48%,#020617)]" />
    <motion.div style={{ opacity: coolOpacity }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(34,211,238,.38),transparent_42%),linear-gradient(120deg,transparent,#083344)]" />
    <div className="absolute inset-0 opacity-35 mix-blend-screen bg-[repeating-linear-gradient(112deg,transparent_0,transparent_28px,rgba(251,146,60,.24)_30px,transparent_33px)]" />
    <div className="relative z-10 mx-auto flex min-h-[74svh] max-w-7xl flex-col justify-center px-6 py-20 text-center lg:px-10"><div className="mx-auto inline-flex items-center gap-2 border border-orange-300/35 bg-orange-950/45 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-orange-100 backdrop-blur"><Flame size={15} className="animate-pulse" /> Rozpálený prostor</div><p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-cyan">Příběh ochlazení</p><h2 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-medium tracking-tight lg:text-6xl">Od žáru po úlevu — krok za krokem.</h2><p className="mx-auto mt-5 max-w-2xl text-white/70">Scrollováním vstoupíte do rozpáleného místa. Jakmile se objeví video pod ním, aktivuje se mlha a celý prostor začne chladnout.</p><div className="mx-auto mt-9 flex items-center gap-3 border border-white/15 bg-slate-950/45 px-5 py-3 backdrop-blur"><ThermometerSun size={22} className="text-orange-300 size-18" /><motion.strong className="font-mono text-2xl text-white">{temperature}</motion.strong><span className="text-xs text-white/45">povrchová teplota</span></div></div>
  </div>;
}