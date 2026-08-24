import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff, Images, Grid3X3, Rows3, Play } from 'lucide-react';

export default function ProductGalleryPanel({ mediaItems, productName, onOpenLightbox }) {
  const safeMedia = Array.isArray(mediaItems) ? mediaItems.filter((item) => item?.url) : [];
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState({});
  const [showAll, setShowAll] = useState(false);
  const reduceMotion = useReducedMotion();
  const thumbRefs = useRef([]);
  const touchStart = useRef(null);

  useEffect(() => {
    setActive(0);
    setShowAll(false);
  }, [productName]);

  useEffect(() => {
    if (active > safeMedia.length - 1) setActive(0);
    thumbRefs.current[active]?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }, [active, safeMedia.length, reduceMotion]);

  if (safeMedia.length === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[28px] border border-slate-200 bg-slate-50 text-slate-300">
        <ImageOff size={28} />
        <span className="font-mono text-xs uppercase tracking-widest">Média doplníme</span>
      </div>
    );
  }

  const current = safeMedia[active];
  const select = (index) => setActive((index + safeMedia.length) % safeMedia.length);
  const prev = (e) => { e?.stopPropagation?.(); select(active - 1); };
  const next = (e) => { e?.stopPropagation?.(); select(active + 1); };
  const openActive = () => onOpenLightbox?.(active);

  const rememberRatio = (src, event) => {
    const img = event.currentTarget;
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setRatios((currentRatios) => currentRatios[src] ? currentRatios : { ...currentRatios, [src]: ratio });
  };

  const useContain = (src) => {
    const ratio = ratios[src];
    return !ratio || ratio < 1.18 || ratio > 1.92;
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

  const videoCount = safeMedia.filter((item) => item.type === 'video').length;
  const imageCount = safeMedia.length - videoCount;

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
          aria-label={`Otevřít médium ${active + 1} z ${safeMedia.length}`}
          className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#f3f6f7] outline-none focus-visible:ring-2 focus-visible:ring-[#0b4860]/50 lg:aspect-[16/11]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,.98),rgba(236,242,244,.92)_58%,rgba(225,234,237,.96)_100%)]" />

          <AnimatePresence mode="wait" initial={false}>
            {current.type === 'video' ? (
              <motion.div
                key={`video-${current.url}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : .25 }}
                className="absolute inset-0"
              >
                <video
                  src={current.url}
                  poster={current.poster}
                  muted
                  playsInline
                  controls
                  preload="metadata"
                  onClick={(event) => event.stopPropagation()}
                  className="h-full w-full bg-black object-contain"
                />
              </motion.div>
            ) : (
              <motion.img
                key={current.url}
                src={current.url}
                alt={`${productName} – fotografie ${active + 1} z ${safeMedia.length}`}
                onLoad={(event) => rememberRatio(current.url, event)}
                loading={active === 0 ? 'eager' : 'lazy'}
                fetchPriority={active === 0 ? 'high' : 'auto'}
                decoding="async"
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.008 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : .34, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-0 h-full w-full ${useContain(current.url) ? 'object-contain p-4 sm:p-6 lg:p-7' : 'object-cover'}`}
              />
            )}
          </AnimatePresence>

          {current.type !== 'video' && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031d26]/35 via-transparent to-black/5" />}

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#031d26]/65 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg backdrop-blur-md">
            {current.type === 'video' ? <Play size={12} fill="currentColor" /> : <Images size={12} />}
            {current.type === 'video' ? 'VIDEO' : 'FOTO'} · {active + 1} / {safeMedia.length}
          </div>

          <div className="absolute bottom-4 left-4 hidden max-w-[70%] rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-md sm:block">
            {productName}
          </div>

          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#031d26]/75 text-white shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <Maximize2 size={16} />
          </span>

          {safeMedia.length > 1 && <>
            <button type="button" onClick={prev} aria-label="Předchozí médium" className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:left-4">
              <ChevronLeft size={17} />
            </button>
            <button type="button" onClick={next} aria-label="Další médium" className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white sm:right-4">
              <ChevronRight size={17} />
            </button>
          </>}
        </div>

        {safeMedia.length > 1 && (
          <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[.16em] text-slate-400">Galerie produktu · {imageCount} foto · {videoCount} video</span>
              <div className="flex items-center gap-2">
                {safeMedia.length > 6 && (
                  <button type="button" onClick={() => setShowAll((value) => !value)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                    {showAll ? <><Rows3 size={12}/> Sbalit</> : <><Grid3X3 size={12}/> Všechna média</>}
                  </button>
                )}
                <button type="button" onClick={openActive} className="hidden text-[11px] font-semibold text-[#0b4860] transition-colors hover:text-[#08394c] sm:inline">Celá obrazovka</button>
              </div>
            </div>
            <div className={showAll ? 'grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5' : 'flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden'} style={showAll ? undefined : { scrollbarWidth: 'none' }}>
              {safeMedia.map((item, i) => (
                <button
                  ref={(node) => { thumbRefs.current[i] = node; }}
                  key={`${item.type}-${item.url}-${i}`}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={active === i ? 'true' : undefined}
                  aria-label={`Zobrazit ${item.type === 'video' ? 'video' : 'fotografii'} ${i + 1} z ${safeMedia.length}`}
                  className={`relative aspect-[4/3] ${showAll ? 'min-w-0' : 'min-w-[96px] snap-start sm:min-w-[116px]'} overflow-hidden rounded-xl border-2 bg-slate-100 transition-all duration-300 ${active === i ? 'border-[#0b4860] shadow-[0_6px_16px_rgba(11,72,96,.13)]' : 'border-transparent opacity-75 hover:opacity-100'}`}
                >
                  {item.type === 'video' ? (
                    <>
                      {item.poster ? <img src={item.poster} alt={`${productName} – video náhled ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-900" />}
                      <span className="absolute inset-0 flex items-center justify-center bg-black/15"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0b4860] shadow"><Play size={15} fill="currentColor" /></span></span>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={`${productName} – náhled ${i + 1}`}
                      loading={i > 4 ? 'lazy' : 'eager'}
                      decoding="async"
                      onLoad={(event) => rememberRatio(item.url, event)}
                      className={`h-full w-full ${useContain(item.url) ? 'object-contain bg-slate-50 p-1' : 'object-cover'}`}
                    />
                  )}
                  <span className={`absolute bottom-1 left-1 rounded-md px-1.5 py-0.5 font-mono text-[8px] font-bold ${active === i ? 'bg-[#0b4860] text-white' : 'bg-black/50 text-white'}`}>
                    {item.type === 'video' ? 'VIDEO' : i === 0 ? 'HLAVNÍ' : String(i + 1).padStart(2, '0')}
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
