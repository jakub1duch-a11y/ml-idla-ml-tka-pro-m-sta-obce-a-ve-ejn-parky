import React, { useState } from 'react';
import { Check, Clock3, Droplets, Gauge, MapPin, Power, Thermometer, Wifi } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import './PdSuplaCityShowcase.css';

const POLNA_PHOTO = '/media/optimized/6a220ebf9_Reference-mstoPolna03.webp';
const PHONE_PHOTO = '/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp';

/**
 * An illustrative SUPLA city-control scene using existing MLŽIDLA media.
 * Polná is the photographed reference, not a claim of live SUPLA telemetry.
 */
export default function PdSuplaCityShowcase() {
  const [demoActive, setDemoActive] = useState(true);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = (event) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--supla-pointer-x', `${Math.round(((event.clientX - rect.left) / rect.width) * 100)}%`);
    event.currentTarget.style.setProperty('--supla-pointer-y', `${Math.round(((event.clientY - rect.top) / rect.height) * 100)}%`);
  };

  return (
    <motion.figure
      className="supla-city-scene relative isolate mx-auto w-full min-w-0 max-w-xl overflow-hidden rounded-[2rem] border border-cyan-100/20 shadow-[0_32px_90px_rgba(0,0,0,.32)]"
      aria-label="Ilustrační přehled chytrého řízení mlžítek s fotografií realizace v Polné"
      onPointerMove={handlePointerMove}
      initial={reducedMotion ? false : { opacity: 0.75, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <img
        src={POLNA_PHOTO}
        alt=""
        loading="lazy"
        decoding="async"
        width="1024"
        height="572"
        className="supla-city-scene__background"
      />
      <div className="supla-city-scene__shade" aria-hidden="true" />
      <div className="supla-city-scene__haze" aria-hidden="true" />
      <div className="supla-city-scene__beam" aria-hidden="true" />
      <div className="supla-city-scene__droplets" aria-hidden="true" />

      <div className="supla-city-scene__heading">
        <span className="supla-city-scene__eyebrow"><Wifi size={14} aria-hidden="true" /> MLŽIDLA · SMART CONTROL</span>
        <span className="supla-city-scene__location"><MapPin size={13} aria-hidden="true" /> Polná · reference</span>
      </div>

      <img
        src={PHONE_PHOTO}
        alt="Ilustrační fotografie držení telefonu s obrazovkou pro ovládání mlžení"
        loading="lazy"
        decoding="async"
        width="631"
        height="1024"
        className="supla-city-scene__phone"
      />

      <div className="supla-city-scene__dashboard" aria-label="Neživá ukázka možností řízení">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-200">SUPLA · ilustrační dashboard</p>
            <h3 className="mt-1 font-heading text-xl font-bold leading-tight text-white">Přehled mlžení</h3>
            <p className="mt-1 text-xs text-slate-200">Ukázka řízení městské zóny</p>
          </div>
          <span className="supla-city-scene__live-tag"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Demo</span>
        </div>

        <div className="supla-city-scene__zone mt-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
              <Droplets size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[.1em] text-slate-300">Ukázková zóna</p>
              <p className="text-sm font-bold text-white">{demoActive ? 'Mlžení zapnuto' : 'Mlžení vypnuto'}</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={demoActive}
            aria-label="Přepnout ukázkový stav mlžení"
            onClick={() => setDemoActive((value) => !value)}
            className={`supla-city-scene__switch ${demoActive ? 'is-on' : ''}`}
          >
            <span className="supla-city-scene__switch-thumb"><Power size={13} aria-hidden="true" /></span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="supla-city-scene__metric">
            <Thermometer size={17} className="text-cyan-200" aria-hidden="true" />
            <p className="mt-2 text-[11px] text-slate-200">Teplota v prostoru</p>
            <p className="mt-1 text-lg font-bold text-white">26 °C<span className="ml-1 text-[9px] font-normal text-cyan-100">ukázka</span></p>
          </div>
          <div className="supla-city-scene__metric">
            <Gauge size={17} className="text-cyan-200" aria-hidden="true" />
            <p className="mt-2 text-[11px] text-slate-200">Spotřeba vody</p>
            <p className="mt-1 text-xs font-semibold text-white">S vodoměrem</p>
            <p className="mt-1 text-[10px] text-cyan-100">možnost sledování</p>
          </div>
          <div className="supla-city-scene__metric col-span-2 flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[11px] text-slate-200"><Clock3 size={15} className="text-cyan-200" aria-hidden="true" /> Časové intervaly</p>
              <p className="mt-1 text-sm font-bold text-white">Nastavitelný provozní plán</p>
            </div>
            <Check size={17} className="shrink-0 text-cyan-200" aria-hidden="true" />
          </div>
        </div>
      </div>

      <figcaption className="supla-city-scene__caption">
        Fotografie realizace v Polné. Ovládací panel je pouze ukázka možností, nikoli živá data či potvrzení instalovaného systému SUPLA v Polné. Funkce vyžadují odpovídající ventily, čidla a měření.
      </figcaption>
    </motion.figure>
  );
}
