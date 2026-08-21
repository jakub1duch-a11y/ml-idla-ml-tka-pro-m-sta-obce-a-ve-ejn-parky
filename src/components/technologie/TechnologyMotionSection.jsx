import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplet, Filter, Gauge, Sparkles, Wifi, Wind } from 'lucide-react';

const FALLBACK_VIDEO = '/media/optimized/858a3a3f3_1283CEC3-EA3F-42B3-9E58-3788630B07A6.webm';
const POSTER = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ccf06b29a_mlzidla-mlzitka-pro-mesta-obce.webp';

const STEPS = [
  { icon: Droplet, label: 'Vodovodní řád' },
  { icon: Filter, label: 'Filtrace' },
  { icon: Wifi, label: 'Řízení' },
  { icon: Gauge, label: 'Trysky' },
  { icon: Wind, label: 'Jemná mlha' },
];

export default function TechnologyMotionSection({ videoUrl = FALLBACK_VIDEO }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);

  return (
    <section className="overflow-hidden border-y border-slate-200 bg-[#061f2b] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:gap-16 lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 backdrop-blur">
            <Sparkles size={13} className="text-cyan-300" />
            <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/70">Motion explainer · technologie</span>
          </div>
          <h2 className="mt-5 max-w-xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] sm:text-4xl lg:text-5xl">Od vody v řádu k jemné mlze. V jednom pohybu.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">Krátká animace vysvětluje nízkotlaký princip bez vysokotlakého čerpadla. Na mobilu se přehrává bez zvuku a bez ovládacích prvků, takže nenarušuje čtení ani výkon stránky.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {STEPS.map((step, index) => (
              <motion.span key={step.label} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .25, delay: index * .035 }} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[.05] px-3 py-2 text-xs font-semibold text-white/75">
                <step.icon size={13} className="text-cyan-300" />{step.label}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <div className="overflow-hidden rounded-[28px] border border-white/12 bg-black shadow-2xl shadow-black/30">
            <video ref={videoRef} src={videoUrl} poster={POSTER} autoPlay={!reduceMotion} muted loop playsInline preload="metadata" className="aspect-video w-full object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
            <div><p className="font-mono text-[8px] uppercase tracking-[.16em] text-white/45">LOW PRESSURE</p><p className="mt-1 text-xs font-semibold text-white">Bez vysokotlakého čerpadla</p></div>
            {!reduceMotion && <motion.span animate={{ scale: [1, 1.22, 1], opacity: [.55, 1, .55] }} transition={{ duration: 2.2, repeat: Infinity }} className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.7)]" />}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
