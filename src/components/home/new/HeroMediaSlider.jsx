import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import HeroVideoPlaylist from '@/components/home/new/HeroVideoPlaylist';
import HeroSliderControls from '@/components/home/new/HeroSliderControls';
import { HERO_SLIDES } from '@/components/home/new/heroSlides';
import useHeroVisibility from '@/components/home/new/useHeroVisibility';
import { playHeroVideo } from '@/components/home/new/useHeroVideo';
import '@/components/home/new/HeroMediaSlider.css';

export default function HeroMediaSlider({ children }) {
  const mediaRef = useRef(null), videoRef = useRef(null), touch = useRef(null);
  const active = useHeroVisibility(mediaRef);
  const reduced = useReducedMotion();
  const lite = navigator.connection?.saveData || /2g/.test(navigator.connection?.effectiveType || '');
  const restricted = (reduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches) || lite;
  const [index, setIndex] = useState(0), [status, setStatus] = useState('loading');
  const [paused, setPaused] = useState(() => restricted), [optedIn, setOptedIn] = useState(false);
  const slide = HERO_SLIDES[index], videoEnabled = !restricted || optedIn;
  const running = active && !paused && videoEnabled;
  const select = useCallback((i) => setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), []);
  useEffect(() => {
    if (!running || !((slide.type === 'image' && status === 'photo') || status === 'error')) return;
    const timer = setTimeout(next, 7000);
    return () => clearTimeout(timer);
  }, [index, slide.type, status, running, next]);
  useEffect(() => {
    if (lite || !['playing', 'photo'].includes(status)) return;
    const timer = setTimeout(() => { const image = new Image(); image.src = HERO_SLIDES[(index + 1) % HERO_SLIDES.length].poster; }, 800);
    return () => clearTimeout(timer);
  }, [index, status, lite]);
  const toggle = () => {
    if (running && status !== 'blocked') { setPaused(true); return; }
    setOptedIn(true); setPaused(false);
    if (videoRef.current) {
      if (videoRef.current.getAttribute('src') !== slide.src) videoRef.current.src = slide.src;
      playHeroVideo(videoRef.current, setStatus);
    }
  };
  const swipe = (event) => {
    if (!touch.current) return;
    const dx = event.changedTouches[0].clientX - touch.current.x, dy = event.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) select(index + (dx < 0 ? 1 : -1));
    touch.current = null;
  };
  return <div className="home-media-slider" role="region" aria-roledescription="karusel" aria-label="Videa a fotografie MLŽIDLA.CZ" onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); select(index + (e.key === 'ArrowRight' ? 1 : -1)); } }}>
    <div ref={mediaRef} className="home-media-slider__media" onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={swipe} onTouchCancel={() => { touch.current = null; }}><HeroVideoPlaylist key={slide.id} slide={slide} running={running} videoEnabled={videoEnabled} videoRef={videoRef} onStatus={setStatus} onNext={next} /></div>
    <div className="hero-media-shade" />{children}<HeroSliderControls index={index} onSelect={select} running={running} status={status} onToggle={toggle} videoEnabled={videoEnabled} />
  </div>;
}