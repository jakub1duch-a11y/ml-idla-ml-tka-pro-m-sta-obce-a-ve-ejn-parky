import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff, Images, Sparkles } from 'lucide-react';

export default function ProductGalleryPanel({ images, productName, onOpenLightbox }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => setActive(0), [productName]);

  if (!images || images.length === 0) {
    return <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[30px] border border-slate-200 bg-gradient-to-br from-white to-slate-100 text-slate-300 shadow-[0_24px_70px_rgba(15,23,42,.06)]"><ImageOff size={28} /><span className="text-xs font-mono uppercase tracking-widest">Fotografie doplníme</span></div>;
  }

  const prev = (e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); };
  const visibleThumbs = images.slice(0, 10);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_25%_20%,rgba(103,190,214,.18),transparent_38%),radial-gradient(circle_at_88%_76%,rgba(148,163,184,.14),transparent_34%)] blur-2xl" />

      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-2.5 shadow-[0_28px_80px_rgba(15,23,42,.10)] backdrop-blur-xl sm:p-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.62fr)_minmax(180px,.62fr)]">
          <button type="button" onClick={() => onOpenLightbox(active)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-slate-200/80 bg-white text-left">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.98),rgba(241,245,249,.86)_58%,rgba(226,232,240,.72))]" />
            <div className="pointer-events-none absolute inset-x-[8%] bottom-[4%] h-[20%] rounded-full bg-slate-300/25 blur-2xl" />

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={images[active]}
                src={images[active]}
                alt={`${productName} – fotografie ${active + 1} z ${images.length}`}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : .985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.01 }}
                transition={{ duration: reduceMotion ? 0 : .34, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-contain p-4 sm:p-6 lg:p-7"
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#062d3a]/10 via-transparent to-white/10" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-[#062d3a]/75 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg backdrop-blur-md"><Images size={12} /> {active + 1} / {images.length}</span>
            <span className="absolute right-4 top-4 hidden items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-[#0b4860] backdrop-blur-md sm:inline-flex"><Sparkles size={11} /> Detail produktu</span>
            <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-[#062d3a]/75 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-[#062d3a]"><Maximize2 size={16} /></span>

            {images.length > 1 && <>
              <button type="button" onClick={prev} aria-label="Předchozí fotografie" className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/88 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white"><ChevronLeft size={17} /></button>
              <button type="button" onClick={next} aria-label="Další fotografie" className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/88 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white"><ChevronRight size={17} /></button>
            </>}
          </button>

          {images.length > 1 && <div className="hidden gap-3 lg:grid lg:grid-rows-2">{images.slice(1, 3).map((img, i) => {
            const index = i + 1;
            return <button key={img + i} type="button" onClick={() => setActive(index)} aria-label={`Zobrazit fotografii ${index + 1}`} className={`group relative overflow-hidden rounded-[22px] border bg-slate-100 transition-all duration-300 ${active === index ? 'border-[#0b4860] shadow-[0_10px_28px_rgba(11,72,96,.12)] ring-2 ring-[#0b4860]/10' : 'border-slate-200 hover:-translate-y-0.5 hover:border-[#0b4860]/25'}`}><img src={img} alt={`${productName} – detail ${index + 1}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-[#062d3a]/28 via-transparent to-transparent opacity-70" /><span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[.14em] text-white/90">Pohled {index + 1}</span></button>;
          })}</div>}
        </div>

        {images.length > 1 && <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>{visibleThumbs.map((img, i) => <button key={img + i} type="button" onClick={() => setActive(i)} aria-label={`Zobrazit fotografii ${i + 1} z ${images.length}`} className={`relative min-w-[92px] overflow-hidden rounded-2xl border-2 bg-slate-100 aspect-[4/3] transition-all duration-300 sm:min-w-[108px] ${active === i ? 'border-[#0b4860] shadow-[0_8px_22px_rgba(11,72,96,.14)] -translate-y-0.5' : 'border-transparent hover:border-slate-300 hover:-translate-y-0.5'}`}><img src={img} alt={`${productName} – náhled ${i + 1}`} className="h-full w-full object-cover" />{active === i && <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-white shadow" />}{i === visibleThumbs.length - 1 && images.length > visibleThumbs.length && <span className="absolute inset-0 flex items-center justify-center bg-[#062d3a]/72 text-xs font-semibold text-white backdrop-blur-sm">+{images.length - visibleThumbs.length}</span>}</button>)}</div>}
      </div>
    </div>
  );
}
