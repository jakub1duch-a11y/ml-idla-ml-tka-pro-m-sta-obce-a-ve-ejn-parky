import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MlzidlaProduktGallery({ product }) {
  const [active, setActive] = useState(0);

  useEffect(() => setActive(0), [product.id]);

  const images = product.gallery;
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[16/10]">
        <img src={images[active]} alt={product.name} className="w-full h-full object-cover" />
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <ChevronLeft size={16} className="text-slate-700" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <ChevronRight size={16} className="text-slate-700" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-3">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            className={`rounded-xl overflow-hidden aspect-[4/3] border-2 transition-colors ${active === i ? 'border-blue-600' : 'border-transparent hover:border-slate-300'}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}