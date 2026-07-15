import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HEADLINES = [
'Mlžítka a mlžné brány pro města, obce a parky.',
'Mlžné brány — vstup skrze zeď mlhy.',
'Mlžítka, která mění veřejný prostor v zážitek.',
'Vaše náměstí, terasa i zahrada — o pár stupňů chladnější.',
'Architektura pro obce a parky, která dýchá mlhou.'];


const TAGLINES = [
'Živá ukázka mlžení v akci.',
'Mikrokapky, které se okamžitě odpaří.',
'Nerezová ocel AISI 316L, zakázková výroba.',
'Smart Wi-Fi řízení podle teploty a vlhkosti.',
'Chlazení bez pocitu mokra — až −9 °C.'];


const SLIDES = [
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
    setTaglineIdx((t) => (t + 1) % HEADLINES.length);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setCurrent(i);
    setTaglineIdx(i % HEADLINES.length);
    timerRef.current = setInterval(next, SLIDE_DURATION);
  };

  useEffect(() => {
    timerRef.current = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 h-[78vh] min-h-[560px]">
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/35 to-black/10 pointer-events-none" />

      {/* Content */}
      <div className="absolute z-30 inset-0 flex flex-col justify-end pb-16">
        <div className="px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono tracking-widest uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Živá ukázka mlžení
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.h1
              key={`headline-${taglineIdx}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight leading-[1.05] max-w-3xl mb-4">
              
              {HEADLINES[taglineIdx]}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`tag-${taglineIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
              className="flex items-center gap-2 text-white/70 text-base font-light max-w-xl mb-8">
              
              <Sparkles size={15} className="text-white/50 shrink-0" /> {TAGLINES[taglineIdx]}
            </motion.p>
          </AnimatePresence>

          {/* Slide dot navigation */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) =>
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Zobrazit ukázku ${i + 1}`}
              className="group py-2">
              
                <span className={`block h-1 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-3 bg-white/30 group-hover:bg-white/60'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>);

}