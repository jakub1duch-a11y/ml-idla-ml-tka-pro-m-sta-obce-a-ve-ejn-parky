import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff } from 'lucide-react';

export default function ProductGalleryPanel({ images, productName, onOpenLightbox }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [productName]);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-100 aspect-[4/3] flex flex-col items-center justify-center text-slate-300 gap-2">
        <ImageOff size={28} />
        <span className="text-xs font-mono uppercase tracking-widest">Fotografie doplní se</span>
      </div>
    );
  }

  const prev = (e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); };

  return (
    <div>
      <button type="button" onClick={() => onOpenLightbox(active)} className="relative block w-full rounded-[1.75rem] overflow-hidden bg-slate-100 aspect-[4/3] group shadow-[0_18px_50px_rgba(15,23,42,.08)]">
        <img src={images[active]} alt={productName} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-slate-700 shadow-sm backdrop-blur">Reálný náhled</span>
        <span className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-slate-950/65 flex items-center justify-center text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
          <Maximize2 size={15} />
        </span>
        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <ChevronLeft size={16} className="text-slate-700" />
            </button>
            <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <ChevronRight size={16} className="text-slate-700" />
            </button>
          </>
        )}
      </button>
      {images.length > 1 && (
        <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-[82px] sm:w-[96px] rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${active === i ? 'border-cyan-700 shadow-sm' : 'border-transparent opacity-75 hover:border-slate-300 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}