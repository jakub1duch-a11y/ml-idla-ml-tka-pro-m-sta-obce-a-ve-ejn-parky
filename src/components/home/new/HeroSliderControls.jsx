import React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { HERO_SLIDES } from '@/components/home/new/heroSlides';

export default function HeroSliderControls({ index, onSelect, running, status, onToggle, videoEnabled }) {
  const slide = HERO_SLIDES[index];
  const paused = !running || status === 'blocked';
  const state = status === 'blocked' ? 'Klepnutím spusťte video' : status === 'error' ? 'Náhled · video není dostupné' : slide.type === 'video' && !videoEnabled ? 'Náhled · úsporný režim' : status === 'loading' ? 'Načítání videa…' : slide.kind;
  return (
    <div className="hero-slider-controls" aria-label="Ovládání hlavního slideru">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold sm:text-sm">{slide.label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{state}</p>
      </div>
      <div className="hero-slider-pagination hidden items-center xl:flex">
        {HERO_SLIDES.map((item, i) => <button key={item.id} type="button" className="hero-slider-button" onClick={() => onSelect(i)} aria-label={`Záběr ${i + 1}: ${item.label}`} aria-current={i === index ? 'true' : undefined}><span className="hero-slider-dot" /></button>)}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] tabular-nums" aria-label={`Záběr ${index + 1} z ${HERO_SLIDES.length}`}>{index + 1}/{HERO_SLIDES.length}</span>
        <button type="button" className="hero-slider-button" onClick={() => onSelect(index - 1)} aria-label="Předchozí záběr"><ChevronLeft size={18} /></button>
        <button type="button" className="hero-slider-button" onClick={onToggle} aria-label={paused ? 'Spustit přehrávání' : 'Pozastavit přehrávání'}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
        <button type="button" className="hero-slider-button" onClick={() => onSelect(index + 1)} aria-label="Další záběr"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}