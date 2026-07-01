import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackHeroInteraction } from '@/lib/ga4';

const defaultSlides = [
{
  slug: 'ostev-mlzny-strom',
  tag: 'Mlžná socha',
  name: 'OSTEV',
  subtitle: 'Mlžný strom.',
  desc: 'Skulptura ve tvaru stromu s integrovaným mlžením. Pro náměstí, eventy a městské prostory. Zakázková výroba z AISI 316L.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.jpg',
  badge: '🌳 NOVÝ PRODUKT',
  cta: '/produkt/ostev-mlzny-strom'
},
{
  slug: 'aura',
  tag: 'Mlžná socha',
  name: 'AURA',
  subtitle: 'Kruh z mlhy.',
  desc: 'Kruhová skulptura z leštěné nerezové oceli s husté mlžením po celém obvodu. Dominanta náměstí, foyer hotelu nebo eventového prostoru.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  badge: '⭐ BESTSELLER',
  cta: '/produkt/aura'
},
{
  slug: 'mrak',
  tag: 'Mlžná socha',
  name: 'MRAK',
  subtitle: 'Nebe na zemi.',
  desc: 'Abstraktní oblak z nerezové oceli s hustým mlžením. Stává se dominantou každého prostoru — parku, terasy, foyer hotelu.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/72a6bb588_mlnprvek-mrak-mlzidla02.png',
  badge: '☁️ URBAN',
  cta: '/produkt/mrak'
},
{
  slug: 'ostev-detail',
  tag: 'Detail trysky',
  name: 'OSTEV',
  subtitle: 'Precizní mlžení.',
  desc: 'Trysky z AISI 316L rozprašují kapičky 10–50 μm, které se okamžitě odpaří. Žádné mokré chodníky, jen příjemný chlad.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3f715c287_copilot_image_1782505642436.jpg',
  badge: '🔬 TECHNOLOGIE',
  cta: '/produkt/ostev-mlzny-strom'
},
{
  slug: 'bendy-60',
  tag: 'Zahradní mlžítko',
  name: 'BENDY 60',
  subtitle: 'Elegantní chlad pro zahradu.',
  desc: 'Stylové zahradní mlžítko s elegantním ohnutým designem. Chladivá mlha pro terasy, zahrady a venkovní odpočívárny.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e7273f60a_bendy60-mlitkozahradn.png',
  badge: '🌿 ZAHRADA',
  cta: '/produkt/bendy-60'
},
{
  slug: 'mlhoviste-deti',
  tag: 'Hřiště & parky',
  name: 'MLŽIŠTĚ',
  subtitle: 'Radost pro děti.',
  desc: 'Interaktivní mlžné prvky pro dětská hřiště a mateřské školy. Bezpečné materiály, potravinářská nerez, bez chemie.',
  image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
  badge: '👧 KIDS',
  cta: '/mlhoviste'
}];


const stats = [
{ val: "25+", label: 'Realizací v ČR a SR' },
{ val: '−9 °C', label: 'Max. ochlazení' },
{ val: '100%', label: 'Bez chemie' },
{ val: "1 Rok", label: "Z\xE1ruka na konstrukci" }];


export default function HeroSection() {
  const [slides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    trackHeroInteraction(slides[idx].name, false);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    const nextIdx = (current + 1) % slides.length;
    setCurrent(nextIdx);
    trackHeroInteraction(slides[nextIdx].name, false);
  }, [current]);

  const prev = useCallback(() => {
    setDirection(-1);
    const prevIdx = (current - 1 + slides.length) % slides.length;
    setCurrent(prevIdx);
    trackHeroInteraction(slides[prevIdx].name, false);
  }, [current]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 })
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-ink">

      {/* Background image with crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current + '-bg'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0">
          
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
            fetchpriority={current === 0 ? 'high' : 'low'}
            decoding="async" />
          
          <div className="absolute inset-0 bg-gradient-to-b via-ink/30 to-ink from-ink/0" />
          <div className="absolute inset-0 bg-gradient-to-d via-ink/60 to-blue from-ink/50" />
        </motion.div>
      </AnimatePresence>

      {/* Slide counter bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-6 lg:px-8 pt-16">
        {slides.map((_, i) =>
        <button
          key={i}
          onClick={() => goTo(i)}
          className="relative h-0.5 flex-1 bg-white/15 overflow-hidden rounded-full">
          
            {i === current &&
          <motion.div
            key={current + '-bar'}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 6, ease: 'linear' }}
            className="absolute inset-0 bg-white origin-left rounded-full" />

          }
            {i < current && <div className="absolute inset-0 bg-white/40 rounded-full" />}
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col justify-end w-full pt-36 pb-12 px-6 z-5 max-w-7xl lg:px-8 mx-auto">

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-xl">
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">{slide.tag}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-medium tracking-widest text-white/60">
                {slide.badge}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-3 font-semibold [font-family:'Urbanist',_sans-serif]">
              {slide.name}
            </h1>
            <h2 className="font-heading font-light text-2xl lg:text-3xl text-white/70 italic leading-tight tracking-tight mb-6">
              {slide.subtitle}
            </h2>
            <p className="text-white/60 text-sm lg:text-base leading-relaxed mb-8 max-w-md font-light">
              {slide.desc ? slide.desc.substring(0, 90) + '...' : ''}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={slide.cta} onClick={() => trackHeroInteraction(slide.name, slide.name)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 text-xs font-medium rounded-full hover:bg-white/90 transition-all">
                Prozkoumat <ArrowRight size={14} />
              </Link>
              <Link to="/kontakt" onClick={() => trackHeroInteraction(slide.name, 'kontakt')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/25 text-white text-xs font-medium rounded-full hover:bg-white/10 transition-all">
                Nezávazná poptávka
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom row: nav arrows + stats */}
        <div className="flex items-end mt-5 gap-1">

          {/* Prev/Next */}
          









          

          {/* Stats */}
          <div className="flex divide-x lg:w-auto ml-auto overflow-hidden divide-slate-400/50 bg-white/75 backdrop-blur-xl rounded-1xl">
            {stats.map((s) =>
            <div key={s.val} className="text-left px-8 opacity-100 py-36">
                <p className="text-slate-900 leading-none mb-2 text-4xl [font-family:'Urbanist',_sans-serif] font-normal">{s.val}</p>
                <p className="text-slate-600 leading-tight text-sm">{s.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}