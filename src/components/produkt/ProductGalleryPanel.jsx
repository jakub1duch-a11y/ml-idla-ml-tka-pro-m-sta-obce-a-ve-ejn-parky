import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff, Images, Sparkles } from 'lucide-react';

export default function ProductGalleryPanel({ images, productName, onOpenLightbox }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const thumbRefs = useRef([]);

  useEffect(() => setActive(0), [productName]);
  useEffect(() => {
    if (active > images.length - 1) setActive(0);
    thumbRefs.current[active]?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }, [active, images.length, reduceMotion]);

  if (!images || images.length === 0) {
    return <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[30px] border border-slate-200 bg-gradient-to-br from-white to-slate-100 text-slate-300 shadow-[0_24px_70px_rgba(15,23,42,.06)]"><ImageOff size={28} /><span className="text-xs font-mono uppercase tracking-widest">Fotografie doplníme</span></div>;
  }

  const select = (index) => setActive((index + images.length) % images.length);
  const prev = (e) => { e?.stopPropagation?.(); select(active - 1); };
  const next = (e) => { e?.stopPropagation?.(); select(active + 1); };
  const visibleThumbs = images.slice(0, 12);
  const secondaryIndexes = images.length > 1
    ? [1, 2].map((offset) => (active + offset) % images.length).filter((index, pos, list) => index !== active && list.indexOf(index) === pos)
    : [];

  const openActive = () => onOpenLightbox(active);
  const handleStageKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openActive(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); prev(event); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(event); }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_25%_20%,rgba(103,190,214,.16),transparent_38%),radial-gradient(circle_at_88%_76%,rgba(148,163,184,.12),transparent_34%)] blur-2xl" />

      <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-2.5 shadow-[0_26px_72px_rgba(15,23,42,.09)] sm:p-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.62fr)_minmax(172px,.58fr)]">
          <div
            role="button"
            tabIndex={0}
            onClick={openActive}
            onKeyDown={handleStageKeyDown}
            aria-label={`Otevřít fotografii ${active + 1} z ${images.length} v galerii`}
            className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[24px] border border-slate-200 bg-[#f6f8f8] outline-none focus-visible:ring-2 focus-visible:ring-[#0b4860]/50 focus-visible:ring-offset-2"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`backdrop-${images[active]}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .28 }} className="absolute inset-0">
                <img src={images[active]} alt="" aria-hidden="true" className="h-full w-full scale-110 object-cover opacity-[.12] blur-2xl" />
                <div className="absolute inset-0 bg-white/78" />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-[10%] bottom-[4%] h-[17%] rounded-full bg-slate-400/15 blur-2xl" />

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={images[active]}
                src={images[active]}
                alt={`${productName} – fotografie ${active + 1} z ${images.length}`}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : .99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.006 }}
                transition={{ duration: reduceMotion ? 0 : .32, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-contain p-3 sm:p-5 lg:p-6"
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#062d3a]/8 via-transparent to-white/10" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-[#062d3a]/80 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg backdrop-blur-md sm:left-4 sm:top-4"><Images size={12} /> {active + 1} / {images.length}</span>
            <span className="absolute right-3 top-3 hidden items-center gap-1.5 rounded-full border border-white/80 bg-white/86 px-3 py-1.5 text-[10px] font-semibold text-[#0b4860] shadow-sm backdrop-blur-md sm:inline-flex sm:right-4 sm:top-4"><Sparkles size={11} /> Celý produkt bez ořezu</span>
            <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-[#062d3a]/82 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-[#062d3a] sm:bottom-4 sm:right-4"><Maximize2 size={16} /></span>

            {images.length > 1 && <>
              <button type="button" onClick={prev} aria-label="Předchozí fotografie" className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:left-4"><ChevronLeft size={17} /></button>
              <button type="button" onClick={next} aria-label="Další fotografie" className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:right-4"><ChevronRight size={17} /></button>
            </>}
          </div>

          {secondaryIndexes.length > 0 && <div className="hidden gap-3 lg:grid lg:grid-rows-2">{secondaryIndexes.map((index) => {
            const img = images[index];
            return <button key={`${img}-${index}`} type="button" onClick={() => setActive(index)} aria-label={`Zobrazit fotografii ${index + 1}`} className="group relative overflow-hidden rounded-[20px] border border-slate-200 bg-[#f6f8f8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0b4860]/30 hover:shadow-[0_10px_26px_rgba(11,72,96,.08)]">
              <img src={img} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-10 blur-lg" />
              <div className="absolute inset-0 bg-white/72" />
              <img src={img} alt={`${productName} – náhled fotografie ${index + 1}`} className="relative h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#062d3a]/45 to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold uppercase tracking-[.13em] text-white">Pohled {index + 1}</span>
            </button>;
          })}</div>}
        </div>

        {images.length > 1 && <div className="mt-3">
          <div className="mb-2 flex items-center justify-between px-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Náhledy produktu</span>
            <button type="button" onClick={openActive} className="text-[11px] font-semibold text-[#0b4860] hover:underline">Otevřít galerii</button>
          </div>
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1.5 pr-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {visibleThumbs.map((img, i) => <button
              ref={(node) => { thumbRefs.current[i] = node; }}
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-current={active === i ? 'true' : undefined}
              aria-label={`Zobrazit fotografii ${i + 1} z ${images.length}`}
              className={`relative aspect-[4/3] min-w-[78px] snap-start overflow-hidden rounded-xl border bg-[#f7f9f9] transition-all duration-250 sm:min-w-[94px] ${active === i ? 'border-[#0b4860] shadow-[0_6px_18px_rgba(11,72,96,.14)] ring-2 ring-[#0b4860]/10' : 'border-slate-200 opacity-80 hover:border-slate-300 hover:opacity-100'}`}
            >
              <img src={img} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[.08] blur-md" />
              <div className="absolute inset-0 bg-white/70" />
              <img src={img} alt={`${productName} – náhled ${i + 1}`} loading={i > 3 ? 'lazy' : 'eager'} className="relative h-full w-full object-contain p-1.5" />
              <span className={`absolute bottom-1 left-1 rounded-md px-1.5 py-0.5 font-mono text-[8px] font-bold ${active === i ? 'bg-[#0b4860] text-white' : 'bg-white/90 text-slate-500 shadow-sm'}`}>{i === 0 ? 'HLAVNÍ' : String(i + 1).padStart(2, '0')}</span>
              {i === visibleThumbs.length - 1 && images.length > visibleThumbs.length && <span className="absolute inset-0 flex items-center justify-center bg-[#062d3a]/74 text-xs font-semibold text-white backdrop-blur-sm">+{images.length - visibleThumbs.length}</span>}
            </button>)}
          </div>
        </div>}
      </div>
    </div>
  );
}
