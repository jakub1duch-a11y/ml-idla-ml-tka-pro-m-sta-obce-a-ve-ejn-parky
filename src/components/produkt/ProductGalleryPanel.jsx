import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageOff, Play, Video, ZoomIn } from 'lucide-react';
import { trackProductLightboxOpen, trackProductMediaSelect } from '@/lib/ga4';

export default function ProductGalleryPanel({ mediaItems, productName, onOpenLightbox, focusUrl }) {
  const [failedUrls, setFailedUrls] = useState(() => new Set());
  const items = Array.isArray(mediaItems)
    ? mediaItems.map((item, originalIndex) => ({ ...item, originalIndex })).filter((item) => item?.url && !failedUrls.has(item.url))
    : [];
  const [active, setActive] = useState(0);
  const [zoomCursor, setZoomCursor] = useState({ visible: false, x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const touchStart = useRef(null);
  const activeItem = items[active];
  const markFailed = (url) => setFailedUrls((current) => {
    const next = new Set(current);
    next.add(url);
    return next;
  });

  useEffect(() => {
    setActive(0);
    setFailedUrls(new Set());
  }, [productName]);
  useEffect(() => {
    if (active > items.length - 1) setActive(0);
  }, [active, items.length]);

  useEffect(() => {
    if (!focusUrl) return;
    const index = items.findIndex((item) => item.url === focusUrl);
    if (index >= 0) setActive(index);
  }, [focusUrl, items]);

  if (items.length === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 text-slate-300">
        <ImageOff size={28} />
        <span className="font-mono text-xs uppercase tracking-widest">Média doplníme</span>
      </div>
    );
  }

  const select = (index) => setActive((index + items.length) % items.length);
  const prev = (event) => { event?.stopPropagation?.(); select(active - 1); };
  const next = (event) => { event?.stopPropagation?.(); select(active + 1); };

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
    <div className="min-w-0 max-w-full space-y-3">
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_12px_36px_rgba(15,23,42,.06)]"
      >
        <div
          className={`relative w-full bg-white ${activeItem.type === 'video' ? 'aspect-video' : 'aspect-[4/3]'}`}
          onMouseMove={(event) => {
            if (activeItem.type === 'video') return;
            const rect = event.currentTarget.getBoundingClientRect();
            setZoomCursor({ visible: true, x: event.clientX - rect.left, y: event.clientY - rect.top });
          }}
          onMouseLeave={() => setZoomCursor((current) => ({ ...current, visible: false }))}
        > 
          <AnimatePresence mode="wait" initial={false}>
            {activeItem.type === 'video' ? (
              <motion.div
                key={`video-${activeItem.url}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="absolute inset-0"
              >
                <video
                  src={activeItem.url}
                  poster={activeItem.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full bg-black object-contain"
                  onError={() => markFailed(activeItem.url)}
                />
              </motion.div>
            ) : (
              <motion.img
                key={`image-${activeItem.url}`}
                src={activeItem.url}
                alt={`${productName} – fotografie ${active + 1}`}
                loading={active === 0 ? 'eager' : 'lazy'}
                fetchPriority={active === 0 ? 'high' : 'auto'}
                decoding="async"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="absolute inset-0 h-full w-full cursor-none object-contain p-1 sm:p-2"
                onError={() => markFailed(activeItem.url)}
                onClick={() => { trackProductLightboxOpen(productName, activeItem.type); onOpenLightbox?.(activeItem.originalIndex); }}
              />
            )}
          </AnimatePresence>

          {activeItem.type !== 'video' && zoomCursor.visible && (
            <div
              className="pointer-events-none absolute z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[#0b4860]/90 text-white shadow-[0_8px_24px_rgba(15,23,42,.24)] backdrop-blur-sm sm:flex"
              style={{ left: zoomCursor.x, top: zoomCursor.y }}
              aria-hidden="true"
            >
              <ZoomIn size={20} strokeWidth={2} />
            </div>
          )}

          {activeItem.type !== 'video' && (
            <button
              type="button"
              onClick={() => { trackProductLightboxOpen(productName, activeItem.type); onOpenLightbox?.(activeItem.originalIndex); }}
              className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white sm:hidden"
              aria-label="Zvětšit fotografii"
            >
              <ZoomIn size={13} /> Zvětšit
            </button>
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Předchozí médium"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Další médium"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[9px] text-white backdrop-blur-sm">
            {active + 1} / {items.length}
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {items.map((item, index) => (
            <button
              key={`${item.type}-${item.url}-${index}`}
              type="button"
              onClick={() => { trackProductMediaSelect(productName, item.type, index); setActive(index); }}
              aria-current={active === index ? 'true' : undefined}
              aria-label={`Zobrazit ${item.type === 'video' ? 'video' : 'fotografii'} ${index + 1}`}
              className={`relative aspect-[4/3] min-w-[92px] overflow-hidden rounded-xl border-2 bg-slate-100 transition sm:min-w-[108px] ${active === index ? 'border-[#0b4860] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              {item.type === 'video' ? (
                <>
                  {item.poster ? (
                    <img src={item.poster} alt="" loading="lazy" decoding="async" className="h-full w-full bg-white object-contain p-1" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white"><Video size={18} /></div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm">
                      <Play size={13} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                  <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[7px] font-bold text-white">VIDEO</span>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={`${productName} – náhled ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full bg-white object-contain p-1"
                  onError={() => markFailed(item.url)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
