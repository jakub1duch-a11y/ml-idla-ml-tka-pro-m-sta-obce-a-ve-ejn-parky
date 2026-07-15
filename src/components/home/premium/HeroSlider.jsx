import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, Wifi, ThermometerSnowflake, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4b5e93510_mlzitka_v_provozu_-_mlzidla_cz.mp4';
const SLIDES = [
  { tag: 'Města, obce, školy a parky', title: 'Mlžítka a mlžné brány pro příjemný veřejný prostor', desc: 'Přirozené ochlazení náměstí, školních dvorů, parků a teras až o 10 °C. Bez čerpadel, přímo z vodovodního řadu.', video: HERO_VIDEO, cta1: { label: 'Poptat řešení', to: '/poptavka' }, cta2: { label: 'Pro města a obce', to: '/kategorie/mesta-obce' } },
  { tag: 'Veřejné prostory', title: 'Ochlazení pro náměstí, hřiště i městské parky', desc: 'Odolné nerezové brány a mlžítka pro bezpečný, atraktivní a komfortní pobyt ve veřejném prostoru.', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png', cta1: { label: 'Prohlédnout brány', to: '/mlzidla-mlzitka' }, cta2: { label: 'Reference realizací', to: '/reference' } },
  { tag: 'Terasy a zahrady', title: 'Jemná mlha pro ochlazení teras a zahrad', desc: 'Designové mlžné prvky vytvářejí pohodlné mikroklima i během horkých letních dnů.', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png', cta1: { label: 'Prohlédnout kolekci', to: '/mlzidla-mlzitka' }, cta2: { label: 'Outdoor a zahrady', to: '/kategorie/outdoor-zahrady' } },
];

const BENEFITS = [
  { icon: ThermometerSnowflake, label: 'Chlazení až −10 °C' },
  { icon: Gauge, label: 'Nízký tlak 2–7 BAR' },
  { icon: Wifi, label: 'Chytré ovládání WiFi' },
  { icon: Droplets, label: 'Nízká spotřeba vody' },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  useEffect(() => { const timer = setInterval(next, 7000); return () => clearInterval(timer); }, [next]);
  const slide = SLIDES[index];

  return (
    <section className="relative h-[100svh] min-h-[520px] sm:min-h-[640px] overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div key={slide.video || slide.image} initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }} className="absolute inset-0">
          {slide.video ? <video src={slide.video} autoPlay muted loop playsInline className="w-full h-full object-cover" /> : <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/15 to-transparent" />
      <div className="absolute inset-0 flex items-center pt-10 sm:pt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full"><div className="max-w-2xl">
          <AnimatePresence mode="wait"><motion.div key={index} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/70 mb-3 sm:mb-4">{slide.tag}</p>
            <h1 className="font-light text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] sm:leading-[1.05] mb-4 sm:mb-5">{slide.title}</h1>
            <p className="text-white/80 leading-relaxed mb-6 sm:mb-8 text-measure text-base sm:text-lg">{slide.desc}</p>
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8 sm:mb-10"><Link to={slide.cta1.to} className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">{slide.cta1.label} <ArrowRight size={16} /></Link><Link to={slide.cta2.to} className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 border border-white/40 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all">{slide.cta2.label}</Link></div>
          </motion.div></AnimatePresence>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pb-24 sm:pb-0">{BENEFITS.map((benefit, i) => <motion.div key={benefit.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.4, 0, 0.2, 1] }} className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15"><benefit.icon size={16} className="text-white/90 shrink-0" /><span className="text-xs text-white/85 font-light leading-tight">{benefit.label}</span></motion.div>)}</div>
        </div></div>
      </div>
      <div className="absolute bottom-5 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 sm:gap-3 z-20"><button onClick={prev} aria-label="Předchozí slide" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"><ChevronLeft size={16} /></button><button onClick={next} aria-label="Další slide" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"><ChevronRight size={16} /></button></div>
      <div className="absolute bottom-5 sm:bottom-8 left-4 sm:left-8 flex items-center gap-2 z-20">{SLIDES.map((item, i) => <button key={item.title} onClick={() => setIndex(i)} aria-label={`Zobrazit slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />)}</div>
    </section>
  );
}