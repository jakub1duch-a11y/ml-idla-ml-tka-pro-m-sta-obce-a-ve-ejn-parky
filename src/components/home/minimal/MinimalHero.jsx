import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
{
  tag: 'Veřejné a komerční prostory',
  title: 'Jemná mlha, dokonalý chlad.',
  desc: 'Ochlazení náměstí, hřišť a event prostor až o 10 °C — nízkotlaká technologie 2–7 BAR.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',
  cta1: { label: 'Poptat systém', to: '/poptavka' },
  cta2: { label: 'Města a obce', to: '/kategorie/mesta-obce' }
},
{
  tag: 'Zahradní mlžné sochy',
  title: 'Design, který ochlazuje.',
  desc: 'Nerezové sochy AURA, Mlžný mrak a Lízátko — umělecký prvek i funkční ochlazení vaší zahrady.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  cta1: { label: 'Prohlédnout kolekci', to: '/mlzidla-mlzitka' },
  cta2: { label: 'Outdoor a zahrady', to: '/kategorie/outdoor-zahrady' }
},
{
  tag: 'Chytré ovládání',
  title: 'Řízeno z mobilu.',
  desc: 'WiFi + aplikace, automatické plány dle počasí, spotřeba vody v reálném čase.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2b0adb03d_mlzitkaholmtec002.png',
  cta1: { label: 'Kalkulačka nákladů', to: '/kalkulacka' },
  cta2: { label: 'Jak to funguje', to: '/jak-to-funguje' }
}];

export default function MinimalHero() {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[100svh] bg-white flex items-center overflow-hidden pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
              <p className="text-xs tracking-[0.3em] uppercase text-teal-600 mb-5">{slide.tag}</p>
              <h1 className="font-heading font-extralight text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.05] mb-6">
                {slide.title}
              </h1>
              <p className="text-slate-500 leading-relaxed mb-8 text-measure text-base sm:text-lg">{slide.desc}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={slide.cta1.to} className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
                  {slide.cta1.label} <ArrowRight size={15} />
                </Link>
                <Link to={slide.cta2.to} className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-full hover:border-slate-500 transition-colors">
                  {slide.cta2.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-12">
            <button onClick={prev} aria-label="Předchozí" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} aria-label="Další" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-colors">
              <ChevronRight size={16} />
            </button>
            <div className="flex items-center gap-1.5 ml-2">
              {SLIDES.map((s, i) =>
              <button key={s.title} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`}
                className={`h-1 rounded-full transition-all ${i === index ? 'w-7 bg-teal-600' : 'w-1 bg-slate-200 hover:bg-slate-400'}`} />
              )}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          <div className="absolute -inset-6 bg-teal-50 rounded-full blur-3xl opacity-70" />
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full aspect-square object-cover rounded-[2.5rem]" />
          </AnimatePresence>
        </div>
      </div>
    </section>);
}