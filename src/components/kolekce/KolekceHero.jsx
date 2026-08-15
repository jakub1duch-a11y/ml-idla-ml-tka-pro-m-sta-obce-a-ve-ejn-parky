import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TAG = 'KOMPLETNÍ KATALOG · ČESKÁ VÝROBA';
const TITLE = 'Mlžítka a mlžné brány pro každý prostor';
const TITLE_MOBILE = 'Mlžítka a mlžné brány';
const DESC = 'Od skulpturálních soch přes vstupní portály až po plošné chladicí zóny. Zakázková výroba z nerezové oceli, navržená přesně pro váš projekt.';

const TAGLINES = [
'Mlžítka – ochlazují prostor, osvěžují pocit.',
'Když prostor chladí, pocit roste.',
'Prostor, který dýchá a osvěžuje.',
'Osvěžení prostoru, které cítíte.',
'Mlžítka – chladnější vzduch, lepší zážitek.',
'Prostor, kde se cítíte lépe.',
'Dotek mlhy, který změní prostor.',
'Ochlazení, které oživí místo.',
'Vytváříme příjemnější místa k životu.',
'Příjemnější místa k životu díky mlžítkům.',
'Mlžítka – vytváří příjemnější místa k životu.',
'Ochlazujeme a vytváříme příjemnější místa k životu.'];


const SLIDES = [
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/78cf9a6c8_KolekceBendy_20260812_121335_0000.mp4' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/eb7e87313_mlzidla-mlzitkaproparkyamesta03.MOV' },
{ type: 'image', src: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/96ec1f8e9_mlnprvek-mrak-mlzidla04.png' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/9f0153e3a_ml_detailvparku_01.MOV' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2ffb4d391_mlzidla-mlzitkaproparkyamesta04.MOV' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ae9faa0a3_video-mlitkospiralavakci.MOV' }];


// Duration per slide: videos ~8s, images 5s
const SLIDE_DURATION = 8000;

function VideoSlide({ src, active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    } else {
      ref.current.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      src={src}
      className="absolute inset-0 w-full h-full object-cover"
      muted
      playsInline
      loop
      preload="metadata" />);


}

export default function KolekceHero() {
  const [current, setCurrent] = useState(0);
  const [taglineIdx, setTaglineIdx] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setTaglineIdx((t) => (t + 1) % TAGLINES.length);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setCurrent(i);
    setTaglineIdx(i % TAGLINES.length);
    timerRef.current = setInterval(next, SLIDE_DURATION);
  };

  useEffect(() => {
    timerRef.current = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden bg-primary h-[58vh] min-h-[380px] max-h-[560px] lg:h-[78vh] lg:min-h-[600px] lg:max-h-none">
      {/* Slides */}
      {SLIDES.map((s, i) =>
      <div
        key={i}
        className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        
          {s.type === 'video' ?
        <VideoSlide src={s.src} active={i === current} /> :
        <img src={s.src} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        </div>
      )}

      {/* Mobile: layered vignette to match the homepage hero treatment */}
      <div
        className="absolute inset-0 z-20 lg:hidden"
        style={{
          backgroundImage:
            'linear-gradient(180deg, hsl(var(--primary) / 0.30) 0%, hsl(var(--primary) / 0) 24%, hsl(var(--primary) / 0) 52%, hsl(var(--primary) / 0.55) 76%, hsl(var(--primary) / 0.93) 100%)'
        }} />
      <div
        className="absolute inset-0 z-20 lg:hidden"
        style={{
          backgroundImage:
            'linear-gradient(90deg, hsl(var(--primary) / 0.22) 0%, hsl(var(--primary) / 0) 18%, hsl(var(--primary) / 0) 82%, hsl(var(--primary) / 0.22) 100%)'
        }} />

      {/* Desktop: brand-color gradient overlay (matches homepage hero, not raw black) */}
      <div className="hidden lg:block absolute inset-0 z-20 bg-gradient-to-t from-primary/95 via-primary/45 to-primary/10 pointer-events-none" />
      <div className="hidden lg:block absolute inset-0 z-20 bg-gradient-to-r from-primary/70 via-primary/20 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute z-30 flex flex-col justify-end pb-8 lg:pb-14 inset-0">
        <div className="px-5 sm:px-6 lg:px-20 max-w-7xl mx-auto w-full">
          <p className="mb-2 lg:mb-4 font-mono font-semibold uppercase tracking-[0.18em] lg:tracking-[0.3em] text-white/85 text-[11px] lg:text-xs [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">{TAG}</p>
          <h1 className="font-heading font-semibold text-white tracking-tight mb-3 lg:mb-5 leading-[1.1] lg:leading-[1.04] text-3xl sm:text-5xl lg:text-7xl max-w-4xl [text-shadow:0_2px_16px_rgba(0,0,0,0.35)]">
            <span className="lg:hidden">{TITLE_MOBILE}</span>
            <span className="hidden lg:inline">{TITLE}</span>
          </h1>
          <p className="hidden lg:block text-measure text-white/90 leading-relaxed font-medium text-lg max-w-xl [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">{DESC}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.h2
            key={`title-${taglineIdx}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="font-heading font-extralight text-3xl lg:text-5xl text-white max-w-2xl leading-tight tracking-tight hidden">

            Mlžítka a mlžidla Holmtec
          </motion.h2>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={`tag-${taglineIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
            className="text-xs font-medium tracking-[0.18em] uppercase text-white/60 mt-3 hidden">
            
            {TAGLINES[taglineIdx]}
          </motion.p>
        </AnimatePresence>

        {/* Dash nav */}
        







        
      </div>
    </div>);

}