import React from 'react';
import useMotionPlayback from '@/components/motion/useMotionPlayback';
import MotionHeading from '@/components/motion/MotionHeading';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const details = [
  { file: 'mlzidla-filter-focus', title: 'Filtrace na vstupu', description: 'Detail filtru a připojení vody.', alt: 'Výřez vodního filtru s modrou hlavou a průhlednou nádobou.' },
  { file: 'mlzidla-valves-zones', title: 'Samostatné zóny', description: 'Přehledné ovládání jednotlivých větví.', alt: 'Dvojice ventilů s postupným zvýrazněním první a druhé zóny.' },
  { file: 'mlzidla-controller-status', title: 'Chytré řízení', description: 'Řídicí modul s indikací stavu.', alt: 'Řídicí modul MLŽIDLA se světelnou indikací.' },
];

export default function CabinetMotionGallery() {
  const { ref, reduced: reduceMotion, paused, setPaused, playing } = useMotionPlayback();
  const extension = playing ? '.gif' : '-poster.webp';
  const source = name => `/media/smart/${name}${extension}`;

  return (
    <div ref={ref} className="relative mx-auto mt-12 max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="overflow-hidden rounded-[2rem] bg-white/90 p-5 shadow-[0_24px_80px_rgba(8,47,63,.08)] sm:p-8">
        <div className="grid items-center gap-7 lg:grid-cols-[.95fr_1.05fr]">
          <figure className="min-w-0">
            <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-cyan-900/10 bg-[#eaf3f4] shadow-[0_20px_42px_rgba(8,47,63,.13)]">
              <picture aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <source media="(max-width: 639px)" srcSet="/media/smart/mlzidla-city-blur-v1-mobile.webp" />
                <img src="/media/smart/mlzidla-city-blur-v1.webp" width="1440" height="810" alt="" className="h-full w-full scale-105 object-cover opacity-80" loading="lazy" decoding="async" />
              </picture>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/15 via-[#eaf6f7]/20 to-[#edf7f8]/80" />
              <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-[#073142]/85 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-white shadow-lg backdrop-blur-xl">
                  <motion.span animate={playing ? { opacity: [0.45, 1, 0.45], scale: [0.8, 1.25, 0.8] } : false} transition={{ duration: 4.5, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-[#7AE1EF] shadow-[0_0_12px_rgba(122,225,239,.95)]" />
                  Animace řešení
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-cyan-950 shadow-sm">{playing ? 'UKÁZKA' : 'PAUZA'}</span>
              </div>
              {playing && (
                <motion.div aria-hidden="true" initial={{ x: '-130%', opacity: 0 }} animate={{ x: '170%', opacity: [0, 0.6, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }} className="pointer-events-none absolute inset-y-0 z-[1] w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm" />
              )}
              <img key={playing ? 'cabinet-motion' : 'cabinet-poster'} src={source('mlzidla-cabinet-open-close')} width="640" height="512" alt="Nerezový rozvaděč MLŽIDLA: dveře s logem se otevřou, ukážou vnitřní výbavu a znovu zavřou." className="relative aspect-[5/4] h-auto w-full object-contain p-3 drop-shadow-[0_18px_18px_rgba(8,47,63,.18)] sm:p-5" loading="lazy" decoding="async" />
              <div className="pointer-events-none absolute inset-x-5 bottom-4 z-10 flex items-center gap-3 rounded-xl border border-white/40 bg-white/70 px-3 py-2 shadow-sm backdrop-blur">
                <motion.span animate={playing ? { scaleX: [0.16, 1, 0.32] } : false} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} className="h-1 w-12 origin-left rounded-full bg-cyan-500" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-cyan-950">{playing ? 'Otevírání · přístup · detail' : 'Statický náhled'}</span>
              </div>
            </div>
            <figcaption className="mt-3 flex items-center justify-center gap-2 text-center text-sm font-semibold text-cyan-900">
              <span className={playing ? 'h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,.85)]' : 'h-2 w-2 rounded-full bg-slate-300'} />
              Přístup pro montáž a servis
            </figcaption>
          </figure>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[.16em] text-cyan-800">Uvnitř chytrého mlžení</p>
            <MotionHeading as="h3" className="mt-3 font-heading text-2xl font-semibold leading-tight tracking-[-.025em] text-[#082f3f] sm:text-3xl">Otevřete si přehled o celém řešení.</MotionHeading>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Za zavřenými dveřmi s logem MLŽIDLA je prostor pro řízení, filtraci a napojení zón. Prohlédněte si otevřený box i jednotlivé části jeho výbavy.</p>
            <p className="mt-3 text-xs leading-5 text-slate-500">Ilustrační sestava a městský prostor. Výbava i způsob montáže se navrhují podle konkrétního místa.</p>
            {reduceMotion === false && (
              <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#073142] px-5 text-sm font-semibold text-white transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">
                {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                {paused ? 'Přehrát ukázky' : 'Zastavit ukázky'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {details.map((detail, index) => (
            <figure key={detail.file} className="group relative min-w-0 overflow-hidden rounded-3xl bg-[#f2fafb] px-4 pb-5 pt-2 shadow-[0_12px_28px_rgba(8,47,63,.05)]">
              <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#073142]/88 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[.14em] text-white shadow-sm">
                <motion.span animate={playing ? { opacity: [0.4, 1, 0.4] } : false} transition={{ duration: 4.5, delay: index * 0.12, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Detail výbavy
              </div>
              {playing && <motion.div aria-hidden="true" initial={{ x: '-145%' }} animate={{ x: '180%' }} transition={{ duration: 3.6, delay: 1.1 + index * 0.25, repeat: Infinity, repeatDelay: 2.4 }} className="pointer-events-none absolute inset-y-0 z-[1] w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent" />}
              <img src={source(detail.file)} width="360" height="360" alt={detail.alt} className="relative mx-auto aspect-square h-auto w-full max-w-[280px] object-contain transition duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
              <figcaption className="relative mt-1 text-center">
                <span className="block text-sm font-bold text-[#082f3f]">{detail.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">{detail.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

