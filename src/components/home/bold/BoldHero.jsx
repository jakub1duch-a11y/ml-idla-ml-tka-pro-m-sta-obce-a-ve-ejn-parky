import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, Wifi, ThermometerSnowflake, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
{
  tag: 'Veřejné a komerční prostory',
  title: 'Mlžné systémy pro města, parky a komerční plochy',
  desc: 'Ochlazení náměstí, hřišť a event prostor až o 10 °C. Nízkotlaká technologie 2–7 BAR, certifikace ČSN EN 1176.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',
  cta1: { label: 'Poptat systém', to: '/poptavka' },
  cta2: { label: 'Města a obce', to: '/kategorie/mesta-obce' }
},
{
  tag: 'Rezidenční a zahradní mlžné sochy',
  title: 'Designové mlžné sochy pro zahrady a terasy',
  desc: 'Nerezové sochy AURA, Mlžný mrak a Lízátko — umělecký prvek i funkční ochlazení vaší zahrady či terasy.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  cta1: { label: 'Prohlédnout kolekci', to: '/mlzidla-mlzitka' },
  cta2: { label: 'Outdoor a zahrady', to: '/kategorie/outdoor-zahrady' }
},
{
  tag: 'Chytré nízkotlaké mlžítko',
  title: 'Řízeno z mobilu, provoz bez čerpadel',
  desc: 'WiFi + aplikace, automatické plány dle počasí, spotřeba vody v reálném čase — vše na 2–7 BAR.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png',
  cta1: { label: 'Kalkulačka nákladů', to: '/kalkulacka' },
  cta2: { label: 'Jak to funguje', to: '/jak-to-funguje' }
}];

const BENEFITS = [
{ icon: ThermometerSnowflake, label: 'Chlazení až −10 °C' },
{ icon: Gauge, label: 'Nízký tlak 2–7 BAR' },
{ icon: Wifi, label: 'Chytré ovládání' },
{ icon: Droplets, label: 'Nízká spotřeba vody' }];

export default function BoldHero() {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover grayscale contrast-125" />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute top-0 left-0 right-0 h-2 bg-red-600" />

      <div className="absolute inset-0 flex items-center pt-10 sm:pt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <span className="inline-block px-3 py-1 bg-red-600 text-white text-[11px] font-black tracking-[0.2em] uppercase mb-4">{slide.tag}</span>
                <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-[0.98] mb-5">
                  {slide.title}
                </h1>
                <p className="text-white/70 leading-relaxed mb-7 text-measure text-base sm:text-lg border-l-4 border-red-600 pl-4">{slide.desc}</p>

                <div className="flex flex-wrap gap-3 mb-8 sm:mb-10">
                  <Link to={slide.cta1.to} className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black text-sm font-black uppercase tracking-wide hover:bg-red-600 hover:text-white transition-colors">
                    {slide.cta1.label} <ArrowRight size={16} />
                  </Link>
                  <Link to={slide.cta2.to} className="inline-flex items-center gap-2 px-7 py-4 border-2 border-white text-white text-sm font-black uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
                    {slide.cta2.label}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pb-24 sm:pb-0">
              {BENEFITS.map((b, i) =>
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-2 px-3 py-3 border border-white/25">
                  <b.icon size={16} className="text-red-500 shrink-0" />
                  <span className="text-xs text-white font-bold uppercase tracking-wide leading-tight">{b.label}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 sm:gap-3 z-20">
        <button onClick={prev} aria-label="Předchozí" className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} aria-label="Další" className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="absolute bottom-5 sm:bottom-8 left-4 sm:left-8 flex items-center gap-2 z-20">
        {SLIDES.map((s, i) =>
        <button key={s.title} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`}
          className={`h-1.5 transition-all ${i === index ? 'w-8 bg-red-600' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
        )}
      </div>
    </section>);
}