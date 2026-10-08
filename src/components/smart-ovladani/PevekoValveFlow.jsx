import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

export default function PevekoValveFlow({ theme = 'dark' }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = reduced === false && !paused;
  const extension = playing ? '.gif' : '-poster.webp';
  const dark = theme === 'dark';

  return (
    <figure className="min-w-0">
      <div className="relative isolate overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#09223a]/35 shadow-[0_24px_70px_rgba(0,0,0,.22)]">
        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-[#071a2f]/85 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-white shadow-lg backdrop-blur-xl">
            <motion.span animate={playing ? { opacity: [0.42, 1, 0.42], scale: [0.78, 1.25, 0.78] } : false} transition={{ duration: 1.45, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.95)]" />
            Živá simulace
          </span>
          <span className="rounded-full bg-white/12 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-cyan-100 backdrop-blur">{playing ? 'Wi‑Fi / online' : 'Pozastaveno'}</span>
        </div>
        {playing && (
          <>
            <motion.div aria-hidden="true" initial={{ x: '-130%', opacity: 0 }} animate={{ x: '170%', opacity: [0, 0.58, 0] }} transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }} className="pointer-events-none absolute inset-y-0 z-[1] w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-cyan-100/30 to-transparent blur-sm" />
            <motion.div aria-hidden="true" animate={{ opacity: [0.25, 0.8, 0.25], scaleX: [0.4, 1, 0.55] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute bottom-5 left-5 z-10 h-1 w-24 origin-left rounded-full bg-cyan-300/90 shadow-[0_0_18px_rgba(103,232,249,.9)]" />
          </>
        )}
        <picture key={playing ? 'peveko-motion' : 'peveko-poster'} className="relative block">
          <source media="(max-width: 639px)" srcSet={`/media/smart/mlzidla-peveko-wifi-flow-v1-mobile${extension}`} />
          <img src={`/media/smart/mlzidla-peveko-wifi-flow-v1-desktop${extension}`} width="720" height="600" alt="Chytrý ventil PEVEKO s ilustračním povelem z mobilu přes SUPLA a Wi-Fi. Proudění vody se spustí a zastaví podle stavu ovládání." className="aspect-[3/4] h-auto w-full object-contain sm:aspect-[6/5]" loading="lazy" decoding="async" />
        </picture>
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-xl border border-white/10 bg-[#071a2f]/78 px-3 py-2 shadow-lg backdrop-blur-xl">
          <p className="font-mono text-[8px] font-bold uppercase tracking-[.16em] text-cyan-200">Signál → ventil → voda</p>
        </div>
      </div>
      <figcaption className={`mt-3 flex flex-wrap items-center justify-between gap-3 px-2 text-xs leading-5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        <span className="inline-flex items-center gap-2"><span className={playing ? 'h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.9)]' : 'h-2 w-2 rounded-full bg-slate-400'} />Princip řízení · ilustrační proudění vody</span>
        {reduced === false && (
          <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${dark ? 'bg-white/10 text-white hover:bg-white/15 focus-visible:ring-offset-[#071a2f]' : 'bg-white text-cyan-900 shadow-sm hover:bg-cyan-50'}`}>
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused ? 'Přehrát ukázku' : 'Zastavit ukázku'}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
