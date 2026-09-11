import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';

export default function GalleryLightbox({
  images = [],
  onClose,
  initialIndex = 0,
  location,
  productUsed,
  title = 'Galerie MLŽIDLA®',
  subtitle,
}) {
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
  }, [initialIndex, images.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') setCurrentIndex((index) => (index - 1 + images.length) % images.length);
      if (event.key === 'ArrowRight') setCurrentIndex((index) => (index + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, onClose]);

  useEffect(() => {
    thumbnailsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [currentIndex]);

  if (!images.length) return null;
  const hasNavigation = images.length > 1;
  const goToPrevious = () => setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  const goToNext = () => setCurrentIndex((index) => (index + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[110] bg-[#031522]/[.97] text-white backdrop-blur-xl" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-5" onClick={(event) => event.stopPropagation()}>
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-heading text-base sm:text-lg">{title}</p>
            {(subtitle || location) && <p className="mt-1 truncate text-xs text-white/60 sm:text-sm">{subtitle || location}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs tracking-widest text-cyan sm:inline">{currentIndex + 1} / {images.length}</span>
            <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[.08] text-white transition hover:border-cyan hover:bg-cyan hover:text-slate-950" aria-label="Zavřít náhled"><X size={20} /></button>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 items-center justify-center py-4 sm:px-14">
          <img key={images[currentIndex]} src={images[currentIndex]} alt={title + ' — fotografie ' + (currentIndex + 1)} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl motion-safe:animate-[fadeIn_.28s_ease-out]" />
          {hasNavigation && <>
            <button type="button" onClick={goToPrevious} className="absolute left-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#031522]/75 text-white transition hover:border-cyan hover:bg-cyan hover:text-slate-950 sm:left-3 sm:h-12 sm:w-12" aria-label="Předchozí fotografie"><ChevronLeft size={23} /></button>
            <button type="button" onClick={goToNext} className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#031522]/75 text-white transition hover:border-cyan hover:bg-cyan hover:text-slate-950 sm:right-3 sm:h-12 sm:w-12" aria-label="Další fotografie"><ChevronRight size={23} /></button>
          </>}
        </div>

        <footer className="shrink-0 border-t border-white/10 pt-3 sm:pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-xs text-white/60">
              <Images size={15} className="shrink-0 text-cyan" />
              <span className="truncate">{productUsed || 'Fotogalerie realizace'}</span>
            </div>
            <span className="font-mono text-[11px] text-white/50 sm:hidden">{currentIndex + 1} / {images.length}</span>
          </div>
          {hasNavigation && (
            <div ref={thumbnailsRef} className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {images.map((image, index) => (
                <button key={image} type="button" onClick={() => setCurrentIndex(index)} aria-label={'Zobrazit fotografii ' + (index + 1)} aria-current={currentIndex === index ? 'true' : undefined} className={['relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-16 sm:w-24', currentIndex === index ? 'border-cyan opacity-100' : 'border-transparent opacity-55 hover:opacity-90'].join(' ')}>
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 font-mono text-[9px] text-white">{index + 1}</span>
                </button>
              ))}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
