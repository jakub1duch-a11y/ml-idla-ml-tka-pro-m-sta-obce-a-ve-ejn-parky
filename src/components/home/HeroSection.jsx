import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
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
    cta: '/produkt/ostev-mlzny-strom',
  },
  {
    slug: 'aura',
    tag: 'Mlžná socha',
    name: 'AURA',
    subtitle: 'Kruh z mlhy.',
    desc: 'Kruhová skulptura z leštěné nerezové oceli s husté mlžením po celém obvodu. Dominanta náměstí, foyer hotelu nebo eventového prostoru.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    badge: '⭐ BESTSELLER',
    cta: '/produkt/aura',
  },
  {
    slug: 'mrak',
    tag: 'Mlžná socha',
    name: 'MRAK',
    subtitle: 'Nebe na zemi.',
    desc: 'Abstraktní oblak z nerezové oceli s hustým mlžením. Stává se dominantou každého prostoru — parku, terasy, foyer hotelu.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
    badge: '☁️ URBAN',
    cta: '/produkt/mrak',
  },
  {
    slug: 'ostev-detail',
    tag: 'Detail trysky',
    name: 'OSTEV',
    subtitle: 'Precizní mlžení.',
    desc: 'Trysky z AISI 316L rozprašují kapičky 10–50 μm, které se okamžitě odpaří. Žádné mokré chodníky, jen příjemný chlad.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3f715c287_copilot_image_1782505642436.jpg',
    badge: '🔬 TECHNOLOGIE',
    cta: '/produkt/ostev-mlzny-strom',
  },
  {
    slug: 'mlhoviste-deti',
    tag: 'Hřiště & parky',
    name: 'MLŽIŠTĚ',
    subtitle: 'Radost pro děti.',
    desc: 'Interaktivní mlžné prvky pro dětská hřiště a mateřské školy. Bezpečné materiály, potravinářská nerez, bez chemie.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
    badge: '👧 KIDS',
    cta: '/mlhoviste',
  },
];

const stats = [
  { val: '120+', label: 'Realizací v ČR a SR' },
  { val: '−9 °C', label: 'Max. ochlazení' },
  { val: '100%', label: 'Bez chemie' },
  { val: '5 let', label: 'Záruka' },
];

export default function HeroSection() {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    base44.entities.Product.list('-updated_date', 10).then(products => {
      if (products && products.length > 0) {
        const dbSlides = products.map(p => ({
          slug: p.slug,
          tag: 'Produkt HolmTec',
          name: p.name,
          subtitle: p.short_description || 'Inovativní řešení',
          desc: p.description || p.short_description || 'Mlžný systém na míru',
          image: p.image_url || defaultSlides[0].image,
          badge: p.featured ? '⭐ FEATURED' : '✨ NOVÝ',
          cta: `/produkt/${p.slug}`,
        }));
        setSlides(dbSlides);
      }
    }).catch(() => setSlides(defaultSlides));
  }, []);

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
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
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
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide counter bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-6 lg:px-8 pt-24">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative h-0.5 flex-1 bg-white/15 overflow-hidden rounded-full"
          >
            {i === current && (
              <motion.div
                key={current + '-bar'}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: 'linear' }}
                className="absolute inset-0 bg-cyan origin-left rounded-full"
              />
            )}
            {i < current && <div className="absolute inset-0 bg-white/40 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-8 pb-12 pt-36 w-full">

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono tracking-widest uppercase text-cyan">{slide.tag}</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono tracking-widest text-white/70">
                {slide.badge}
              </span>
            </div>

            <h1 className="font-heading font-extralight text-7xl lg:text-9xl text-white leading-[0.9] tracking-tight mb-2">
              {slide.name}
            </h1>
            <h2 className="font-heading font-extralight text-4xl lg:text-5xl text-white/50 italic leading-tight tracking-tight mb-5">
              {slide.subtitle}
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-8 max-w-lg">
              {slide.desc}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to={slide.cta} onClick={() => trackHeroInteraction(slide.name, slide.name)}
                className="flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
                Prozkoumat {slide.name} <ArrowRight size={16} />
              </Link>
              <Link to="/kontakt" onClick={() => trackHeroInteraction(slide.name, 'kontakt')}
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                Nezávazná poptávka
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom row: nav arrows + thumbnails + stats */}
        <div className="mt-10 flex flex-col lg:flex-row lg:items-end gap-6">

          {/* Thumbnail strip */}
          <div className="flex gap-2 flex-1">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                onClick={() => goTo(i)}
                className={`relative group overflow-hidden rounded-xl flex-1 transition-all duration-300 ${
                  i === current ? 'ring-2 ring-cyan ring-offset-1 ring-offset-ink' : 'opacity-50 hover:opacity-80'
                }`}
                style={{ aspectRatio: '3/2', maxWidth: 120 }}
              >
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-ink/50" />
                <p className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-mono text-white/80 tracking-widest uppercase px-1 truncate">
                  {s.name}
                </p>
              </button>
            ))}
          </div>

          {/* Prev/Next */}
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-mono text-white/30 w-12 text-center">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 lg:w-auto">
            {stats.map((s) => (
              <div key={s.val} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-3 text-center">
                <p className="font-heading font-light text-xl text-cyan leading-none mb-1">{s.val}</p>
                <p className="text-[10px] text-white/40 font-mono leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}