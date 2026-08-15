import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, ImageOff, Images } from 'lucide-react';

export default function ProductGalleryPanel({ images, productName, onOpenLightbox }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [productName]);

  if (!images || images.length === 0) {
    return <div className="rounded-2xl bg-slate-100 aspect-[4/3] flex flex-col items-center justify-center text-slate-300 gap-2"><ImageOff size={28} /><span className="text-xs font-mono uppercase tracking-widest">Fotografie doplní se</span></div>;
  }

  const prev = (e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); };
  const visibleThumbs = images.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.55fr)_minmax(170px,.7fr)]">
        <button type="button" onClick={() => onOpenLightbox(active)} className="relative block w-full rounded-3xl overflow-hidden bg-slate-100 aspect-[4/3] group border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,.06)]">
          <img src={images[active]} alt={`${productName} – hlavní fotografie ${active + 1} z ${images.length}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md"><Images size={13} /> {active + 1} / {images.length}</span>
          <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/55 flex items-center justify-center text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"><Maximize2 size={16} /></span>
          {images.length > 1 && <><button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"><ChevronLeft size={16} className="text-slate-700" /></button><button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"><ChevronRight size={16} className="text-slate-700" /></button></>}
        </button>
        {images.length > 1 && <div className="hidden sm:grid grid-rows-2 gap-3">{images.slice(1, 3).map((img, i) => <button key={img + i} type="button" onClick={() => setActive(i + 1)} aria-label={`Zobrazit fotografii ${i + 2}`} className={`relative overflow-hidden rounded-2xl bg-slate-100 group border transition-all ${active === i + 1 ? 'border-[#0b4860] shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}><img src={img} alt={`${productName} – detail ${i + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></button>)}</div>}
      </div>
      {images.length > 1 && <div className="flex gap-2.5 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 lg:grid-cols-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>{visibleThumbs.map((img, i) => <button key={img + i} type="button" onClick={() => setActive(i)} aria-label={`Zobrazit fotografii ${i + 1} z ${images.length}`} className={`relative min-w-[92px] overflow-hidden rounded-xl aspect-[4/3] border-2 transition-all sm:min-w-0 ${active === i ? 'border-[#0b4860] shadow-[0_6px_18px_rgba(11,72,96,.12)]' : 'border-transparent hover:border-slate-300'}`}><img src={img} alt={`${productName} – náhled ${i + 1}`} className="w-full h-full object-cover" />{i === visibleThumbs.length - 1 && images.length > visibleThumbs.length && <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-xs font-semibold text-white">+{images.length - visibleThumbs.length}</span>}</button>)}</div>}
    </div>
  );
}
