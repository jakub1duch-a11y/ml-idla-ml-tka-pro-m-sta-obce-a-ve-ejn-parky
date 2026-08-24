import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff, Images } from 'lucide-react';

export default function ProductGalleryPanel({ images, productName, onOpenLightbox }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState({});
  const reduceMotion = useReducedMotion();
  const thumbRefs = useRef([]);
  const touchStart = useRef(null);

  useEffect(() => setActive(0), [productName]);
  useEffect(() => {
    if (active > safeImages.length - 1) setActive(0);
    thumbRefs.current[active]?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }, [active, safeImages.length, reduceMotion]);

  if (safeImages.length === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[28px] border border-slate-200 bg-slate-50 text-slate-300">
        <ImageOff size={28} />
        <span className="font-mono text-xs uppercase tracking-widest">Fotografie doplníme</span>
      </div>
    );
  }

  const select = (index) => setActive((index + safeImages.length) % safeImages.length);
  const prev = (e) => { e?.stopPropagation?.(); select(active - 1); };
  const next = (e) => { e?.stopPropagation?.(); select(active + 1); };
  const openActive = () => onOpenLightbox?.(active);

  const rememberRatio = (src, event) => {
    const img = event.currentTarget;
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setRatios((current) => current[src] ? current : { ...current, [src]: ratio });
  };

  const useContain = (src) => {
    const ratio = ratios[src];
    return ratio && (ratio < 1.08 || ratio > 2.05);
  };

  const handleStageKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openActive(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); prev(event); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(event); }
  };

  const onTouchStart = (event) => {
    touchStart.current = event.touches?.[0]?.clientX ?? null;
  };

  const onTouchEnd = (event) => {
    if (touchStart.current == null) return;
    const end = event.changedTouches?.[0]?.clientX;
    if (end == null) return;
    const delta = end - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 48) return;
    delta > 0 ? select(active - 1) : select(active + 1);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.10)]">
        <div
          role="button"
          tabIndex={0}
          onClick={openActive}
          onKeyDown={handleStageKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label={`Otevřít fotografii ${active + 1} z ${safeImages.length}`}
          className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#edf1f2] outline-none focus-visible:ring-2 focus-visible:ring-[#0b4860]/50"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`background-${safeImages[active]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : .24 }}
              className="absolute inset-0"
            >
              <img
                src={safeImages[active]}
                alt=""
                aria-hidden="true"
                className="h-full w-full scale-110 object-cover opacity-30 blur-2xl"
              />
              <div className="absolute inset-0 bg-[#071f29]/10" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={safeImages[active]}
              src={safeImages[active]}
              alt={`${productName} – fotografie ${active + 1} z ${safeImages.length}`}
              onLoad={(event) => rememberRatio(safeImages[active], event)}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.012 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : .34, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-0 h-full w-full ${useContain(safeImages[active]) ? 'object-contain p-3 sm:p-5' : 'object-cover'}`}
            />
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031d26]/35 via-transparent to-black/5" />

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#031d26]/65 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md">
            <Images size={12} /> {active + 1} / {safeImages.length}
          </div>

          <div className="absolute bottom-4 left-4 hidden max-w-[70%] rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-md sm:block">
            {productName}
          </div>

          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#031d26]/75 text-white shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <Maximize2 size={16} />
          </span>

          {safeImages.length > 1 && <>
            <button type="button" onClick={prev} aria-label="Předchozí fotografie" className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:left-4">
              <ChevronLeft size={17} />
            </button>
            <button type="button" onClick={next} aria-label="Další fotografie" className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:right-4">
              <ChevronRight size={17} />
            </button>
          </>}
        </div>

        {safeImages.length > 1 && (
          <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-400">Galerie produktu</span>
              <button type="button" onClick={openActive} className="text-[11px] font-semibold text-[#0b4860] transition-colors hover:text-[#08394c]">Zobrazit přes celou obrazovku</button>
            </div>
            <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {safeImages.map((img, i) => (
                <button
                  ref={(node) => { thumbRefs.current[i] = node; }}
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={active === i ? 'true' : undefined}
                  aria-label={`Zobrazit fotografii ${i + 1} z ${safeImages.length}`}
                  className={`relative aspect-[4/3] min-w-[96px] snap-start overflow-hidden rounded-xl border-2 bg-slate-100 transition-all duration-300 sm:min-w-[116px] ${active === i ? 'border-[#0b4860] shadow-[0_6px_16px_rgba(11,72,96,.13)]' : 'border-transparent opacity-75 hover:opacity-100'}`}
                >
                  <img
                    src={img}
                    alt={`${productName} – náhled ${i + 1}`}
                    loading={i > 4 ? 'lazy' : 'eager'}
                    decoding="async"
                    onLoad={(event) => rememberRatio(img, event)}
                    className={`h-full w-full ${useContain(img) ? 'object-contain bg-slate-50 p-1' : 'object-cover'}`}
                  />
                  <span className={`absolute bottom-1 left-1 rounded-md px-1.5 py-0.5 font-mono text-[8px] font-bold ${active === i ? 'bg-[#0b4860] text-white' : 'bg-black/50 text-white'}`}>
                    {i === 0 ? 'HLAVNÍ' : String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
