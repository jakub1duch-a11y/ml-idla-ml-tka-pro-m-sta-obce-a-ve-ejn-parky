import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Droplets, Gauge, Wifi, ThermometerSnowflake, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
{
  tag: 'ČESKÁ VÝROBA · 20 LET PRŮMYSLOVÉ ZKUŠENOSTI',
  title: 'Nerezová mlžítka a mlžné brány s chytrým řízením',
  desc: 'Navrhujeme a vyrábíme nerezová mlžítka pro města a obce, náměstí, promenády, parky, gastro, wellness, hotely i rezidenční terasy a zahrady.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/518c8c2a3_mlzitka-pro-mesta.jpg alt="Nerezové designové mlžítka pro města a obcetí"'
      'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/69ad8a562_mlzitkomrkev-mesto-polna2.webp alt="Nerezové designové mlžítko MRKEV pro Polenské náměstí"',
    'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3ed2ba00a_Reference-mstoPolna02.webp alt="Designové mlžítko pro mesto Polná"',
  cta1: { label: 'Prohlédnout česká mlžítka', to: '/mlzidla-mlzitka' },
  cta2: { label: 'Popsat projekt', to: '/poptavka' }
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
    <section className="relative min-h-[740px] h-[100svh] overflow-hidden bg-background lg:h-screen lg:min-h-[640px]">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.image} src={slide.image}

          alt={slide.title}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: [1.03, 1.08, 1.03], x: [0, -10, 0] }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 }, scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 22, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-center" />
        
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-primary/10 lg:from-primary/95 lg:via-primary/25 lg:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/35 to-transparent" />

      <div className="absolute inset-0 flex items-end lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 pb-6 pt-24 sm:px-8 sm:pb-10 lg:px-20 lg:py-24">
          <div className="max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
                <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 sm:mb-4 sm:text-xs sm:tracking-[0.3em]">{slide.tag}</p>
                <h1 className="mb-4 max-w-4xl font-heading font-semibold leading-[1.04] tracking-tight text-white sm:mb-5 text-4xl sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                <p className="text-measure mb-6 text-base font-medium leading-relaxed text-white/90 sm:mb-8 sm:text-lg">{slide.desc}</p>

                <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-10 sm:flex sm:flex-wrap">
                  <Link to={slide.cta1.to} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-center text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl sm:px-7 sm:py-4">
                    {slide.cta1.label} <ArrowRight size={16} />
                  </Link>
                  <Link to={slide.cta2.to} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 bg-primary/20 px-6 py-3.5 text-center text-sm font-semibold text-white transition-all hover:bg-white/10 sm:px-7">
                    {slide.cta2.label}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BENEFITS.map((b, i) =>
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="flex min-h-14 items-center gap-2 rounded-xl border border-white/20 bg-primary/30 px-3 py-3 backdrop-blur-md sm:bg-white/5">
                
                  <b.icon size={20} className="text-white/90 shrink-0" />
                  <span className="text-xs text-white/85 font-medium leading-tight">{b.label}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {SLIDES.length > 1 && <div className="absolute bottom-8 right-8 z-20 hidden items-center gap-3 sm:flex">
        <button onClick={prev} aria-label="Předchozí snímek" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronLeft size={16} />
        </button>
        <button onClick={next} aria-label="Další snímek" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>}

      {SLIDES.length > 1 && <div className="absolute bottom-8 left-8 z-20 flex items-center gap-2">
        {SLIDES.map((s, i) => <span key={s.title} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />)}
      </div>}
    </section>);

}