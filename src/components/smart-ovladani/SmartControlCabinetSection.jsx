import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

export default function SmartControlCabinetSection() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = reduceMotion === false && !paused;
  const extension = playing ? '.gif' : '-poster.webp';

  return (
    <section className="relative overflow-hidden border-y border-cyan-100 bg-[#f7fcfd] py-14 sm:py-18 lg:py-24" aria-labelledby="smart-cabinet-title">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(120deg,transparent_0_48%,rgba(60,160,180,.12)_48.2%,transparent_48.8%),linear-gradient(32deg,transparent_0_70%,rgba(122,225,239,.12)_70.2%,transparent_70.7%)] [background-size:620px_620px,760px_760px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-800">Rozvaděč MLŽIDLA.cz / chytré mlžení</p>
          <h2 id="smart-cabinet-title" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight tracking-[-.035em] text-[#082f3f] sm:text-4xl lg:text-5xl">Řízení, filtrace a měření v jednom přehledném bodě.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Nerezový box chrání chytrý ventil, filtr, snímač průtoku a napojení zón. Konkrétní výbava se volí podle počtu mlžítek, přívodu vody a požadovaného režimu.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {['chytrý ventil a Wi‑Fi řízení','filtrace a kontrola průtoku','skryté provedení pro veřejný prostor','přístup pro servis a zimní údržbu'].map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-100 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">{item}</div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">Ilustrační grafika · výbava a rozmístění se potvrzují podle konkrétního projektu.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <figure className="overflow-hidden rounded-[2rem] border border-cyan-100 bg-white/80 p-3 shadow-[0_24px_80px_rgba(8,47,63,.10)]">
            <figcaption className="px-3 pb-3 pt-1 text-xs font-bold uppercase tracking-[.16em] text-cyan-800">Chytré ovládání a přehled vody</figcaption>
            <picture key={playing ? 'motion' : 'poster'}>
              <source media="(max-width: 639px)" srcSet={`/media/smart/mlzidla-smart-display-v3-mobile${extension}`} />
              <img src={`/media/smart/mlzidla-smart-display-v3-desktop${extension}`} alt="Chytré ovládání MLŽIDLA: zapnutí mlžení, časový plán a přehled vody. Ilustrační obrazovky." width="800" height="600" className="aspect-[2/3] h-auto w-full rounded-[1.5rem] bg-[#f7fcfd] object-contain sm:aspect-[4/3]" loading="lazy" decoding="async" />
            </picture>
            {reduceMotion === false && (
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-100 bg-white/90 px-4 text-xs font-semibold text-slate-700 transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
                  {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                  {paused ? 'Přehrát animaci' : 'Zastavit animaci'}
                </button>
              </div>
            )}
          </figure>

          <figure className="overflow-hidden rounded-[2rem] border border-cyan-100 bg-white/80 p-3 shadow-[0_24px_80px_rgba(8,47,63,.10)]">
            <figcaption className="px-3 pb-3 pt-1 text-xs font-bold uppercase tracking-[.16em] text-cyan-800">Mlžné mlžítko</figcaption>
            <img src="/media/optimized/31478e4b3_bendymlzitko02.webp" alt="Nerezové mlžítko BENDY v provozu s jemnou vodní mlhou." width="800" height="600" className="aspect-[4/3] h-auto w-full rounded-[1.5rem] bg-[#f7fcfd] object-cover" loading="lazy" decoding="async" />
            <p className="px-3 pb-2 pt-3 text-sm leading-6 text-slate-600">Produktový náhled mlžítka v prostoru. Konkrétní tvar, počet trysek a rozmístění se potvrzují podle projektu.</p>
          </figure>
        </div>
      </div>
    </section>
  );
}
