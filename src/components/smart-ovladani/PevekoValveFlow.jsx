import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

export default function PevekoValveFlow({ theme = 'dark' }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const playing = reduced === false && !paused;
  const extension = playing ? '.gif' : '-poster.webp';
  const dark = theme === 'dark';

  return (
    <figure className="min-w-0">
      <picture key={playing ? 'peveko-motion' : 'peveko-poster'}>
        <source media="(max-width: 639px)" srcSet={`/media/smart/mlzidla-peveko-wifi-flow-v1-mobile${extension}`} />
        <img src={`/media/smart/mlzidla-peveko-wifi-flow-v1-desktop${extension}`} width="720" height="600" alt="Chytrý ventil PEVEKO s ilustračním povelem z mobilu přes SUPLA a Wi-Fi. Proudění vody se spustí a zastaví podle stavu ovládání." className="aspect-[3/4] h-auto w-full object-contain sm:aspect-[6/5]" loading="lazy" decoding="async" />
      </picture>
      <figcaption className={`mt-1 flex flex-wrap items-center justify-between gap-3 px-2 text-xs leading-5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        <span>Princip řízení · ilustrační proudění vody</span>
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
