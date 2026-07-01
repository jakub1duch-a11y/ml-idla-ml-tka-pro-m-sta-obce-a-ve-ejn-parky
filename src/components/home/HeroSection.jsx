import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
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

const stats = [
{ val: "25+", label: 'Realizací v ČR a SR' },
{ val: '−9 °C', label: 'Max. ochlazení' },
{ val: '100%', label: 'Bez chemie' },
{ val: "1 Rok", label: "Záruka na konstrukci" }];

export default function HeroSection() {
  const [slides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // 2.5D parallax tilt for the product photo
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });
  const shiftX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), { stiffness: 150, damping: 20 });
  const shiftY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-16, 16]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 })
  };

  return (
    <section className="relative bg-white pt-28 pb-14 lg:pt-40 lg:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

        {/* Text */}
        <div className="relative min-h-[300px] flex flex-col justify-center order-2 lg:order-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: 'easeOut' }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono tracking-widest uppercase mb-6">
                {slide.badge} · {slide.tag}
              </span>
              <h1 className="font-heading font-light text-5xl lg:text-6xl text-slate-900 tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
                {slide.name}
              </h1>
              <p className="italic text-2xl lg:text-3xl text-slate-400 font-light mb-5">{slide.subtitle}</p>
              <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-md mb-8 font-light">{slide.desc}</p>
              <Link to={slide.cta}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
                Zobrazit produkt <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            {slides.map((s, i) => (
              <button key={s.slug} onClick={() => goTo(i)} aria-label={s.name}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-slate-900' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`} />
            ))}
          </div>
        </div>

        {/* 2.5D product photo */}
        <div className="relative order-1 lg:order-2" style={{ perspective: 1200 }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl shadow-slate-900/10 bg-slate-100">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={slide.image} custom={direction}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0">
                <motion.img src={slide.image} alt={slide.name} style={{ x: shiftX, y: shiftY, scale: 1.12 }}
                  className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          <button onClick={prev} aria-label="Předchozí"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white shadow-md transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Další"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white shadow-md transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Stats — glass minimal strip */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-14 lg:mt-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-slate-200 divide-x divide-y lg:divide-y-0 divide-slate-200 overflow-hidden bg-slate-50/60 backdrop-blur">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-6 text-center">
              <p className="font-heading font-light text-2xl lg:text-3xl text-slate-900">{s.val}</p>
              <p className="text-xs text-slate-500 mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}