import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Droplets, Banknote, ThermometerSnowflake, CloudFog, Gauge } from 'lucide-react';
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
  badge: 'Nový produkt',
  cta: '/produkt/ostev-mlzny-strom'
},
{
  slug: 'aura',
  tag: 'Mlžná socha',
  name: 'AURA',
  subtitle: 'Kruh z mlhy.',
  desc: 'Kruhová skulptura z leštěné nerezové oceli s husté mlžením po celém obvodu. Dominanta náměstí, foyer hotelu nebo eventového prostoru.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  badge: 'Bestseller',
  cta: '/produkt/aura'
},
{
  slug: 'mrak',
  tag: 'Mlžná socha',
  name: 'MRAK',
  subtitle: 'Nebe na zemi.',
  desc: 'Abstraktní oblak z nerezové oceli s hustým mlžením. Stává se dominantou každého prostoru — parku, terasy, foyer hotelu.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/72a6bb588_mlnprvek-mrak-mlzidla02.png',
  badge: 'Urban',
  cta: '/produkt/mrak'
},
{
  slug: 'ostev-detail',
  tag: 'Detail trysky',
  name: 'OSTEV',
  subtitle: 'Precizní mlžení.',
  desc: 'Trysky z AISI 316L rozprašují kapičky 10–50 μm, které se okamžitě odpaří. Žádné mokré chodníky, jen příjemný chlad.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3f715c287_copilot_image_1782505642436.jpg',
  badge: 'Technologie',
  cta: '/produkt/ostev-mlzny-strom'
},
{
  slug: 'bendy-60',
  tag: 'Zahradní mlžítko',
  name: 'BENDY 60',
  subtitle: 'Elegantní chlad pro zahradu.',
  desc: 'Stylové zahradní mlžítko s elegantním ohnutým designem. Chladivá mlha pro terasy, zahrady a venkovní odpočívárny.',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e7273f60a_bendy60-mlitkozahradn.png',
  badge: 'Zahrada',
  cta: '/produkt/bendy-60'
},
{
  slug: 'mlhoviste-deti',
  tag: 'Hřiště & parky',
  name: 'MLŽIŠTĚ',
  subtitle: 'Radost pro děti.',
  desc: 'Interaktivní mlžné prvky pro dětská hřiště a mateřské školy. Bezpečné materiály, potravinářská nerez, bez chemie.',
  image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
  badge: 'Kids',
  cta: '/mlhoviste'
}];

const features = [
{ icon: Droplets, label: 'Spotřeba vody', value: '6–10 l/h' },
{ icon: Banknote, label: 'Provozní náklady', value: 'od 15 Kč / 8 hod' },
{ icon: ThermometerSnowflake, label: 'Ochlazení prostoru', value: 'až o −9 °C' },
{ icon: CloudFog, label: 'Nízkotlaká mlha', value: "kapky 10 - 50 \u03BCm" },
{ icon: Gauge, label: 'Napojení na vodovodní řád', value: 'min. tlak 2 bar' }];


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

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const textVariants = {
    enter: (dir) => ({ opacity: 0, y: dir > 0 ? 24 : -24 }),
    center: { opacity: 1, y: 0 },
    exit: (dir) => ({ opacity: 0, y: dir > 0 ? -24 : 24 })
  };

  return (
    <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden bg-slate-900">
      {/* Full-bleed photo */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={slide.image} custom={direction}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0">
          <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full lg:px-8 pb-10 sm:pb-14">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/80 mb-5 sm:mb-6 flex-wrap">
                {slide.badge} · {slide.tag}
              </span>
              <h1 className="text-white tracking-tight mb-2 normal-case text-left text-4xl sm:text-5xl lg:text-6xl [font-family:'Albert_Sans',_sans-serif] font-medium" style={{ letterSpacing: '-0.03em' }}>
                {slide.name}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-white/60 font-light mb-4 sm:mb-5 not-italic text-left no-underline normal-case">{slide.subtitle}</p>
              <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mb-6 sm:mb-8 font-light">{slide.desc}</p>
              <Link to={slide.cta}
              className="btn-pulse inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold">
                Zobrazit produkt <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            {slides.map((s, i) =>
            <button key={s.slug} onClick={() => goTo(i)} aria-label={s.name}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`} />
            )}
          </div>
        </div>

        {/* Feature icons strip */}
        <div className="relative border-t backdrop-blur-xl border-white/20 bg-black/0">
          <div className="mx-auto max-w-7xl py-2 sm:py-3 px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x lg:divide-y-0 divide-white/10">
              {features.map((f) =>
              <div key={f.label} className="flex items-center gap-3 py-3.5 sm:py-5 px-2 sm:px-4">
                  <f.icon size={20} className="shrink-0 text-white/80" />
                  <div className="min-w-0">
                    <p className="leading-tight truncate text-xs sm:text-sm text-[#8c8c8c]">{f.label}</p>
                    <p className="font-medium leading-tight truncate uppercase text-base sm:text-lg text-[#4776b8]">{f.value}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={prev} aria-label="Předchozí"
      className="hidden sm:flex absolute left-3 lg:left-8 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} aria-label="Další"
      className="hidden sm:flex absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronRight size={18} />
      </button>
    </section>);

}