import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/74a4e8604_mlzidla-mlzitkaproparkyamesta01.MP4' },
{ type: 'image', src: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9aa2c2600_mlzitka-mlzicizonyhriste.jpg' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/eb7e87313_mlzidla-mlzitkaproparkyamesta03.MOV' },
{ type: 'image', src: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/96ec1f8e9_mlnprvek-mrak-mlzidla04.png' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/9f0153e3a_ml_detailvparku_01.MOV' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2ffb4d391_mlzidla-mlzitkaproparkyamesta04.MOV' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/ae9faa0a3_video-mlitkospiralavakci.MOV' },
{ type: 'video', src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/a4e40221e_video-mlitkospiralavakci.MOV' }];


// Duration per slide: videos ~8s, images 5s
const SLIDE_DURATION = 6000;

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
    <div className="relative w-full overflow-hidden bg-slate-900 h-[70vh] min-h-[480px]">
      {/* Slides */}
      {SLIDES.map((s, i) =>
      <div
        key={i}
        className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        
          {s.type === 'video' ?
        <VideoSlide src={s.src} active={i === current} /> :

        <img src={s.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
        }
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute z-30 flex flex-col justify-end px-8 lg:px-16 pb-12 inset-0">
        <AnimatePresence mode="wait">
          








          
        </AnimatePresence>
        <AnimatePresence mode="wait">
          








          
        </AnimatePresence>

        {/* Dash nav */}
        <div className="flex gap-1.5 mt-6">
          {SLIDES.map((_, i) =>
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-px rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'}`} />

          )}
        </div>
      </div>
    </div>);

}