import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const details = [
  { file: 'mlzidla-filter-focus', title: 'Filtrace na vstupu', description: 'Detail filtru a připojení vody.', alt: 'Výřez vodního filtru s modrou hlavou a průhlednou nádobou.' },
  { file: 'mlzidla-valves-zones', title: 'Samostatné zóny', description: 'Přehledné ovládání jednotlivých větví.', alt: 'Dvojice ventilů s postupným zvýrazněním první a druhé zóny.' },
  { file: 'mlzidla-controller-status', title: 'Chytré řízení', description: 'Řídicí modul s indikací stavu.', alt: 'Řídicí modul MLŽIDLA se světelnou indikací.' },
];

export default function CabinetMotionGallery() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = reduceMotion === false && !paused;
  const extension = playing ? '.gif' : '-poster.webp';
  const source = name => `/media/smart/${name}${extension}`;

  return (
    <div className="relative mx-auto mt-12 max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="overflow-hidden rounded-[2rem] bg-white/85 p-5 shadow-[0_24px_80px_rgba(8,47,63,.08)] sm:p-8">
        <div className="grid items-center gap-7 lg:grid-cols-[.95fr_1.05fr]">
          <figure className="min-w-0">
            <img key={playing ? 'cabinet-motion' : 'cabinet-poster'} src={source('mlzidla-cabinet-open-close')} width="640" height="512" alt="Nerezový rozvaděč MLŽIDLA: dveře s logem se otevřou, ukážou vnitřní výbavu a znovu zavřou." className="aspect-[5/4] h-auto w-full object-contain" loading="lazy" decoding="async" />
            <figcaption className="mt-2 text-center text-sm font-semibold text-cyan-900">Přístup pro montáž a servis</figcaption>
          </figure>
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[.16em] text-cyan-800">Uvnitř chytrého mlžení</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight tracking-[-.025em] text-[#082f3f] sm:text-3xl">Otevřete si přehled o celém řešení.</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Za zavřenými dveřmi s logem MLŽIDLA je prostor pro řízení, filtraci a napojení zón. Prohlédněte si otevřený box i jednotlivé části jeho výbavy.</p>
            <p className="mt-3 text-xs leading-5 text-slate-500">Ilustrační sestava. Výbava i způsob montáže se navrhují podle konkrétního místa.</p>
            {reduceMotion === false && (
              <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#073142] px-5 text-sm font-semibold text-white transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">
                {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                {paused ? 'Přehrát ukázky' : 'Zastavit ukázky'}
              </button>
            )}
          </div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {details.map(detail => (
            <figure key={detail.file} className="min-w-0 rounded-3xl bg-[#f2fafb] px-4 pb-5 pt-2">
              <img src={source(detail.file)} width="360" height="360" alt={detail.alt} className="mx-auto aspect-square h-auto w-full max-w-[280px] object-contain" loading="lazy" decoding="async" />
              <figcaption className="mt-1 text-center">
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
