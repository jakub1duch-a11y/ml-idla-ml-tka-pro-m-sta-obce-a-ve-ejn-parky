import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Schválené produktové vizuály obsahují vlastní sazbu a popisek.
// Pro mobil vždy používáme samostatný vertikální zdroj, nikoliv ořez desktopu.
const SLIDES = [
  {
    id: 'steblo-gate',
    title: 'STÉBLO GATE®',
    desktop: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/403df930a_steblo_gate_hero_desktop_20261031.webp',
    mobile: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3cdcb3f46_steblo_gate_hero_mobile_20261031.webp',
    link: '/produkt/brana-bendy',
    alt: 'STÉBLO GATE – dvě zakřivená nerezová stébla tvořící průchozí mlžnou bránu na náměstí',
    width: 1672,
    height: 941,
  },
  {
    id: 'mrak-1414',
    title: 'MLŽNÝ MRAK 1414',
    desktop: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c17688a2a_mrak1414_hero_desktop.webp',
    mobile: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f153e7fbe_mrak1414_hero_mobile.webp',
    link: '/produkt/mlzny-mrak-1414',
    alt: 'MLŽNÝ MRAK 1414 – organicky ohýbaná nerezová mlžná socha mezi květinami v zahradě',
    width: 1672,
    height: 941,
  },
];

export default function TopGateHeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef(null);
  const select = useCallback((next) => setIndex((SLIDES.length + next % SLIDES.length) % SLIDES.length), []);
  useEffect(() => {
    if (paused || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 8500);
    return () => window.clearInterval(timer);
  }, [paused]);
  const slide = SLIDES[index];
  return (
    <section
      className="relative isolate w-full bg-[#07131d] pt-[var(--site-header-height,80px)]"
      aria-label="Hlavní produktový slider MLŽIDLA.cz"
      aria-roledescription="karusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onTouchStart={(event) => { pointerStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={(event) => {
        if (!pointerStart.current) return;
        const dx = event.changedTouches[0].clientX - pointerStart.current.x;
        const dy = event.changedTouches[0].clientY - pointerStart.current.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) select(index + (dx < 0 ? 1 : -1));
        pointerStart.current = null;
      }}
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <Link
          key={slide.id}
          to={slide.link}
          aria-label={`Prohlédnout produkt ${slide.title}`}
          className="relative block w-full overflow-hidden bg-[#07131d] focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
        >
          <picture>
            <source media="(max-width: 639px)" srcSet={slide.mobile} type="image/webp" />
            <img
              src={slide.desktop}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="block h-auto w-full object-contain"
            />
          </picture>
        </Link>
        <nav
          className="relative z-10 flex min-h-14 items-center justify-between gap-3 border-t border-white/10 bg-[#07131d] px-4 py-2 text-white sm:px-8"
          aria-label="Výběr produktového snímku"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tabular-nums text-sky-300" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
            <span className="hidden text-sm font-semibold tracking-wide sm:block" style={{ fontFamily: "'Albert Sans', Arial, sans-serif" }}>{slide.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300" aria-label="Předchozí slide" onClick={() => select(index - 1)}><ArrowLeft size={19} /></button>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300" aria-label="Další slide" onClick={() => select(index + 1)}><ArrowRight size={19} /></button>
            <Link to={slide.link} className="ml-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#168ee7] px-4 text-xs font-bold text-white transition hover:bg-[#0a77c8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:text-sm" style={{ fontFamily: "'Albert Sans', Arial, sans-serif" }}>Detail produktu <ArrowRight size={16} /></Link>
          </div>
        </nav>
      </div>
    </section>
  );
}
