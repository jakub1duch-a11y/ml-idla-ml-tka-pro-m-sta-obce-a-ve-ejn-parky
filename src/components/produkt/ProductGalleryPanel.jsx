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
      <button type="button" onClick={() => onOpenLightbox(active)} className="relative block w-full rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] group">
        <img src={images[active]} alt={productName} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
        <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div className="grid grid-cols-5 gap-2.5 mt-3">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-lg overflow-hidden aspect-[4/3] border-2 transition-colors ${active === i ? 'border-slate-900' : 'border-transparent hover:border-slate-300'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}