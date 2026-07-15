import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff } from 'lucide-react';

export default function ProductGalleryPanel({ images, productName, onOpenLightbox }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  useEffect(() => { setActive(0); }, [productName]);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-100 aspect-[4/3] flex flex-col items-center justify-center text-slate-300 gap-2">
        <ImageOff size={28} />
        <span className="text-xs font-mono uppercase tracking-widest">Fotografie doplní se</span>
      </div>
    );
  }

  const goTo = (i) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };
  const prev = (e) => { e.stopPropagation(); setDirection(-1); setActive((a) => (a - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setDirection(1); setActive((a) => (a + 1) % images.length); };

  return (
    <div>
      <button type="button" onClick={() => onOpenLightbox(active)} className="relative block w-full rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={active}
            src={images[active]}
            alt={productName}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </AnimatePresence>
        <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Maximize2 size={15} />
        </span>
        {images.length > 1 && (
          <>
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-[11px] font-mono tracking-wide z-10">
              Snímek {active + 1} z {images.length}
            </span>
            <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10">
              <ChevronLeft size={16} className="text-slate-700" />
            </button>
            <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10">
              <ChevronRight size={16} className="text-slate-700" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 z-10">
              <motion.div
                className="h-full bg-white"
                initial={false}
                animate={{ width: `${((active + 1) / images.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
          </>
        )}
      </button>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2.5 mt-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => goTo(i)}
              className={`relative rounded-lg overflow-hidden aspect-[4/3] border-2 transition-colors ${active === i ? 'border-slate-900' : 'border-transparent hover:border-slate-300'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-white drop-shadow">{i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}