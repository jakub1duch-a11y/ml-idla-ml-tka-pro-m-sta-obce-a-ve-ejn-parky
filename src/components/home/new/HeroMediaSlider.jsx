import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import HeroVideoPlaylist from '@/components/home/new/HeroVideoPlaylist';
import { HERO_SLIDES } from '@/components/home/new/heroSlides';
import { base44 } from '@/api/base44Client';
import useHeroVisibility from '@/components/home/new/useHeroVisibility';
import '@/components/home/new/HeroMediaSlider.css';

export default function HeroMediaSlider({ children }) {
  const mediaRef = useRef(null), videoRef = useRef(null), touch = useRef(null);
  const active = useHeroVisibility(mediaRef);
  const reduced = useReducedMotion();
  const lite = navigator.connection?.saveData || /2g/.test(navigator.connection?.effectiveType || '');
  const restricted = (reduced ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches) || lite;
  const [zooVideos, setZooVideos] = useState([]);
  useEffect(() => {
    let mounted = true;
    base44.entities.Realizace.get('6a42491409abbf575447aaeb').then(project => {
      const sources = [project?.video_url, ...(project?.gallery_urls || [])].filter(url => /^https?:\/\//i.test(url || '') && /\.(mp4|webm)(\?.*)?$/i.test(url));
      if (mounted) setZooVideos([...new Set(sources)].map((src, i) => ({ id: `zoo-video-${i}`, type: 'video', src, poster: project?.image_url || HERO_SLIDES[0].poster, label: `ZOO Praha · video ${i + 1}`, kind: 'Video realizace' })));
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  const slides = zooVideos.length ? [...zooVideos, ...HERO_SLIDES] : HERO_SLIDES;
  const [index, setIndex] = useState(0), [status, setStatus] = useState('loading');
  const paused = restricted;
  const slide = slides[index], videoEnabled = !restricted;
  const running = active && !paused && videoEnabled;
  const select = useCallback((i) => setIndex((i + slides.length) % slides.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  useEffect(() => {
    if (!running || !((slide.type === 'image' && status === 'photo') || status === 'error')) return;
    const timer = setTimeout(next, 7000);
    return () => clearTimeout(timer);
  }, [index, slide.type, status, running, next]);
  useEffect(() => {
    if (lite || !['playing', 'photo'].includes(status)) return;
    const timer = setTimeout(() => { const image = new Image(); image.src = slides[(index + 1) % slides.length].poster; }, 800);
    return () => clearTimeout(timer);
  }, [index, status, lite]);
  const swipe = (event) => {
    if (!touch.current) return;
    const dx = event.changedTouches[0].clientX - touch.current.x, dy = event.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) select(index + (dx < 0 ? 1 : -1));
    touch.current = null;
  };
  return <div className="home-media-slider" role="region" aria-roledescription="karusel" aria-label="Videa a fotografie MLŽIDLA.CZ" onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); select(index + (e.key === 'ArrowRight' ? 1 : -1)); } }}>
    <div ref={mediaRef} className="home-media-slider__media" onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchEnd={swipe} onTouchCancel={() => { touch.current = null; }}><HeroVideoPlaylist key={slide.id} slide={slide} running={running} videoEnabled={videoEnabled} videoRef={videoRef} onStatus={setStatus} onNext={next} /></div>
    <div className="hero-media-shade" />{children}
  </div>;
}