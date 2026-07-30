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
  cta2: { label: 'Kategorie města a obce', to: '/kategorie/mesta-obce' }
}];



const BENEFITS = [
{ icon: ThermometerSnowflake, label: 'Chlazení až −10 °C' },
{ icon: Gauge, label: 'Nízký tlak 2–7 BAR' },
{ icon: Wifi, label: 'Chytré ovládání WiFi' },
{ icon: Droplets, label: 'Nízká spotřeba vody' }];


export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section className="relative h-screen overflow-hidden bg-[#F8F9FA] min-h-[640px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.image} src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/518c8c2a3_mlzitka-pro-mesta.jpg"

          alt={slide.title}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover" />
        
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-black/0" />
      <div className="absolute inset-0 bg-gradient-to-r via-black/10 to-transparent from-black/0" />

      <div className="absolute inset-0 items-center flex">
        <div className="lg:px-20 w-500 max-w-7x2 mx-auto px-6">
          <div className="max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
                <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/70 mb-4">{slide.tag}</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-5 [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">
                  {slide.title}
                </h1>
                <p className="text-white/70 leading-relaxed mb-8 text-measure text-lg">{slide.desc}</p>

                <div className="flex flex-wrap gap-3 mb-10">
                  <Link to={slide.cta1.to} className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">
                    {slide.cta1.label} <ArrowRight size={16} />
                  </Link>
                  <Link to={slide.cta2.to} className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/40 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all">
                    {slide.cta2.label}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2">
              {BENEFITS.map((b, i) =>
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-2 px-3 py-3 rounded-xl backdrop-blur-md border border-white/15 bg-white/0">
                
                  <b.icon size={16} className="text-white/90 shrink-0 size-14" />
                  <span className="text-xs text-white/85 font-light leading-tight">{b.label}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3 z-20">
        <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="absolute bottom-8 left-8 flex items-center gap-2 z-20">
        {SLIDES.map((s, i) => null





        )}
      </div>
    </section>);

}