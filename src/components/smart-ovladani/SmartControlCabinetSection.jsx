import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, Power, SlidersHorizontal, Droplets, Wrench } from 'lucide-react';
import CabinetMotionGallery from './CabinetMotionGallery';

const features = [
  { icon: Power, title: 'Zapnout a vypnout', text: 'Přehledný stav ovládané zóny.' },
  { icon: SlidersHorizontal, title: 'Nastavit režim', text: 'Ruční ovládání i časový plán.' },
  { icon: Droplets, title: 'Sledovat vodu', text: 'Spotřeba a průtok podle výbavy.' },
  { icon: Wrench, title: 'Přístup k výbavě', text: 'Řízení a filtrace v nerezovém boxu.' },
];

export default function SmartControlCabinetSection() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = reduceMotion === false && !paused;
  const extension = playing ? '.gif' : '-poster.webp';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f3fafb] via-[#f8fcfd] to-white py-14 sm:py-20 lg:py-24" aria-labelledby="smart-cabinet-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,transparent_0_48%,rgba(60,160,180,.10)_48.2%,transparent_48.8%),linear-gradient(32deg,transparent_0_70%,rgba(122,225,239,.10)_70.2%,transparent_70.7%)] [background-size:620px_620px,760px_760px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-800">SUPLA / chytré řízení MLŽIDLA</p>
          <h2 id="smart-cabinet-title" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight tracking-[-.035em] text-[#082f3f] sm:text-4xl lg:text-5xl">Ovládání po ruce.<br />Voda v přehledu.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Zapněte nebo vypněte mlžení, upravte režim a prohlédněte si přehled vody. Ukázka vás provede ovládáním v mobilu a výbavou, která stojí za chytrým mlžením.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white/90 p-4 shadow-[0_8px_30px_rgba(8,47,63,.04)]">
                <Icon size={20} className="mb-3 text-cyan-700" aria-hidden="true" />
                <p className="text-sm font-bold text-[#082f3f]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-lg text-xs leading-5 text-slate-500">Vizualizace ovládání SUPLA s ukázkovými daty. Měření spotřeby a průtoku závisí na připojeném snímači a konfiguraci; vzhled aplikace se může lišit.</p>
        </div>

        <div className="min-w-0">
          <figure className="relative isolate overflow-hidden rounded-[2rem] border border-white/75 bg-white/75 px-3 pb-5 pt-4 shadow-[0_32px_90px_rgba(8,47,63,.15)] sm:px-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,226,232,.22),transparent_65%)]" />
            <div className="pointer-events-none absolute inset-x-5 top-5 z-10 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-[#073142]/90 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-white shadow-lg backdrop-blur-xl">
                <motion.span animate={playing ? { opacity: [0.5, 1, 0.5], scale: [0.85, 1.18, 0.85] } : false} transition={{ duration: 1.6, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-[#7AE1EF] shadow-[0_0_12px_rgba(122,225,239,.95)]" />
                Živá ukázka
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#073142] shadow-sm backdrop-blur">{playing ? 'Přehrávání' : 'Náhled'}</span>
            </div>
            {playing && (
              <motion.div aria-hidden="true" initial={{ x: '-130%', opacity: 0 }} animate={{ x: '160%', opacity: [0, 0.72, 0] }} transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }} className="pointer-events-none absolute inset-y-0 z-[1] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-sm" />
            )}
            <img key={playing ? 'supla-motion' : 'supla-poster'} src={`/media/smart/mlzidla-supla-phone-v4${extension}`} alt="Vizualizace ovládání SUPLA v mobilu: vypnutí, zapnutí, konfigurace zón a přehled spotřeby vody s průtokem. Ukázková data." width="480" height="720" className="relative mx-auto aspect-[2/3] h-auto w-full max-w-[400px] object-contain drop-shadow-[0_26px_26px_rgba(8,47,63,.17)]" loading="lazy" decoding="async" />
            <div className="relative mx-auto mt-1 flex max-w-[370px] items-center gap-3 rounded-xl border border-cyan-900/10 bg-white/75 px-3 py-2 shadow-sm backdrop-blur">
              <motion.span animate={playing ? { scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] } : false} transition={{ duration: 1.8, repeat: Infinity }} className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.7)]" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[.15em] text-cyan-950">{playing ? 'Data a režimy se postupně mění' : 'Ukázka je pozastavena'}</span>
              <motion.span aria-hidden="true" animate={playing ? { scaleX: [0.2, 1, 0.35] } : false} transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut' }} className="ml-auto h-1 w-10 origin-left rounded-full bg-cyan-400" />
            </div>
            <figcaption className="relative mt-3 text-center text-sm font-bold text-[#082f3f]">Mlžení, nastavení a voda. V jednom mobilu.</figcaption>
            {reduceMotion === false && (
              <div className="relative mt-4 flex justify-center">
                <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#073142] px-5 text-xs font-semibold text-white transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">
                  {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                  {paused ? 'Přehrát ukázku SUPLA' : 'Zastavit ukázku SUPLA'}
                </button>
              </div>
            )}
          </figure>
          <figure className="mt-4 flex items-center gap-4 overflow-hidden rounded-2xl bg-white/70 p-3">
            <img src="/media/optimized/31478e4b3_bendymlzitko02.webp" alt="Nerezové mlžítko BENDY v prostoru s jemnou mlhou." width="112" height="112" className="h-24 w-24 shrink-0 rounded-xl object-cover" loading="lazy" decoding="async" />
            <figcaption className="min-w-0 text-sm leading-6 text-slate-600"><span className="block font-bold text-[#082f3f]">Od mobilu k mlžítku.</span>Řízení se navrhuje pro konkrétní prostor, počet mlžítek a režim provozu.</figcaption>
          </figure>
        </div>
      </div>
      <CabinetMotionGallery />
    </section>
  );
}
