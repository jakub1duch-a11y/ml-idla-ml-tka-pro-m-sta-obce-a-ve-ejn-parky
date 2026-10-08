import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
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
          <figure className="relative overflow-hidden rounded-[2rem] bg-white/75 px-3 pb-5 pt-4 shadow-[0_24px_80px_rgba(8,47,63,.09)] sm:px-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,226,232,.22),transparent_65%)]" />
            <img key={playing ? 'supla-motion' : 'supla-poster'} src={`/media/smart/mlzidla-supla-phone-v4${extension}`} alt="Vizualizace ovládání SUPLA v mobilu: vypnutí, zapnutí, konfigurace zón a přehled spotřeby vody s průtokem. Ukázková data." width="480" height="720" className="relative mx-auto aspect-[2/3] h-auto w-full max-w-[400px] object-contain" loading="lazy" decoding="async" />
            <figcaption className="relative mt-2 text-center text-sm font-bold text-[#082f3f]">Mlžení, nastavení a voda. V jednom mobilu.</figcaption>
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
