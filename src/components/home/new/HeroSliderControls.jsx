import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '@/components/home/new/HeroVideoPlaylist';

export default function HeroSliderControls({ index, setIndex }) {
  const n = HERO_SLIDES.length;
  const go = (d) => setIndex((i) => (i + d + n) % n);
  return (
    <div className="absolute bottom-6 right-5 z-30 flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-md sm:right-8 lg:right-12">
      <button type="button" onClick={() => go(-1)} aria-label="Předchozí video" className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15"><ChevronLeft size={16} /></button>
      <div className="flex gap-1.5">
        {HERO_SLIDES.map((s, i) => (
          <button key={s.src} type="button" onClick={() => setIndex(i)} aria-label={s.label} aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#26C6E9]' : 'w-1.5 bg-white/50'}`} />
        ))}
      </div>
      <button type="button" onClick={() => go(1)} aria-label="Další video" className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15"><ChevronRight size={16} /></button>
      <span className="hidden pr-1 text-[10px] font-bold uppercase tracking-[.14em] text-white/70 md:inline">{HERO_SLIDES[index].label}</span>
    </div>
  );
}