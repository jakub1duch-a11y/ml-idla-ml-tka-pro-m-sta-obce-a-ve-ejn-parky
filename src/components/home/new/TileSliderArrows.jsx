import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Šipky pro posuvný slider dlaždic (mobil i desktop do lg).
export default function TileSliderArrows({ trackRef }) {
  const go = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  const btn = 'flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#26C6E9] hover:text-[#06283A] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]';
  return (
    <div className="mb-3 flex justify-end gap-2 lg:hidden">
      <button type="button" aria-label="Předchozí produkt" className={btn} onClick={() => go(-1)}><ChevronLeft size={20} /></button>
      <button type="button" aria-label="Další produkt" className={btn} onClick={() => go(1)}><ChevronRight size={20} /></button>
    </div>
  );
}