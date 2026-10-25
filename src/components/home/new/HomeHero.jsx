import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';
import HomeHeroMotion from '@/components/home/new/HomeHeroMotion';
import HeroMediaSlider from '@/components/home/new/HeroMediaSlider';
import '@/components/ui/HeroAtmosphere.css';
import TileSliderArrows from '@/components/home/new/TileSliderArrows';
import { ArrowRight, Wind, Droplets, Gauge, ShieldCheck } from 'lucide-react';

const benefits = [
{ icon: Wind, text: 'Cíleně osvěžuje pobytovou zónu' },
{ icon: Droplets, text: 'Jemná mlha pro příjemnější pobyt' },
{ icon: Gauge, text: 'Úsporný provoz a chytré řízení' },
{ icon: ShieldCheck, text: 'Odolná nerezová konstrukce' }];

// Primární H1 záměrně obsahuje hlavní produktové dotazy a zůstává přirozený pro návštěvníka.
const headlineWords = ['Mlžítka pro', 'města, obce', 'i zahrady.'];

const tiles = [
{
  title: 'LINEA CE',
  text: 'Nerezová linie s charakteristickým ohybem',
  image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp',
  link: '/produkt/linea-solo'
},
{
  title: 'MRAK',
  text: 'Hravé osvěžení pro děti a hřiště',
  image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
  link: '/produkt/mlzny-mrak-1414'
},
{
  title: 'MLŽNÁ BRÁNA',
  text: 'Průchozí vodní mlha pro náměstí',
  image: '/media/optimized/a2d77392e_Mlnbranyaportaly.webp',
  link: '/mlzne-brany'
},
{
  title: 'BENDY',
  text: 'Organická linie pro pobytové zóny',
  image: '/media/optimized/b47ae10f2_bendymlzitko.webp',
  link: '/produkt/mlzitko-bendy'
}];

export default function HomeHero() {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
    <section className="hero-motion-surface ref-editorial-surface relative overflow-hidden bg-secondary text-secondary-foreground" aria-label="MLŽIDLA.CZ hero">
      <HeroMediaSlider>
        {!reduced && <div className="pointer-events-none hidden lg:block"><HomeHeroMotion /></div>}

        <div className="home-hero-copy relative z-10 mx-auto grid max-w-[1540px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-12 xl:px-20">
          <motion.div className="max-w-3xl" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="hero-brand-kicker"><span className="hero-brand-kicker__icon"><Droplets size={16} aria-hidden="true" /></span><span>Kapka úlevy · přirozené osvěžení</span></div>
            <p className="font-mono text-sm font-bold uppercase tracking-[.22em] text-[#A9E6F5]">MLŽENÍ, KTERÉ DÁVÁ SMYSL</p>
            <h1 className="mt-5 max-w-[11ch] font-semibold leading-[.94] tracking-[-.055em] text-white [font-family:'Manrope',_'Inter',_sans-serif] text-[clamp(2.85rem,13vw,4.6rem)] sm:mt-6 sm:max-w-[10ch] sm:text-6xl lg:text-7xl text-left" aria-label={headlineWords.join(' ')}>
              {headlineWords.map((word, index) =>
                <motion.span
                  key={word}
                  className="hero-headline-word"
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : .52, delay: reduced ? 0 : .12 + index * .075, ease: [0.22, 1, 0.36, 1] }}>
                  {word}
                </motion.span>
                )}
            </h1>
            <p className="hero-intro mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-lg">
              Designová městská i zahradní mlžítka, mlžné brány a mlhoviště pro náměstí, parky, hřiště, sportoviště a terasy. Návrh i chytré řízení podle konkrétního místa.
            </p>
            <div className="hero-actions mt-9 flex flex-wrap gap-4">
              <Link to="/poptavka" className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#18B7E6] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-[#06283A] shadow-[0_22px_60px_rgba(24,183,230,.32)] transition hover:-translate-y-0.5 hover:bg-[#69DDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07131D]">
                Navrhnout řešení <ArrowRight size={17} />
              </Link>
              <Link to="/katalog-mlzitek" className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/35 bg-white/[.10] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-white backdrop-blur-md transition hover:border-white/60 hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35"><ArrowRight size={15} /></span>
                Prohlédnout produkty
              </Link>
            </div>
          </motion.div>

          <motion.aside data-home-pointer="10" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="ref-cursor-glow hidden rounded-[2rem] border p-5 lg:block border-white/0 bg-[#000000]/[0.0] backdrop-blur-x0" aria-label="Hlavní přínosy mlžítek">
            <div className="space-y-4">
              {benefits.map(({ icon: Icon, text }) =>
                <div key={text} className="grid grid-cols-[54px_1fr] items-center gap-4 rounded-3xl border p-4 bg-white/[.0] border-white/0">
                  <div className="flex h-11 w-11 items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <p className="text-xl leading-6 text-slate-200 [font-family:'Manrope',_'Inter',_sans-serif] font-bold">{text}</p>
                </div>
                )}
            </div>
          </motion.aside>
        </div>
      </HeroMediaSlider>

      <div className="ref-float-rail"><span>MLŽIDLA / 01</span><i /></div>
      <div className="relative z-20 mx-auto max-w-[1540px] px-4 pb-10 sm:px-8 lg:px-12 xl:px-20">
        <TileSliderArrows trackRef={trackRef} />
        <div ref={trackRef} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {tiles.map((tile, index) =>
            <motion.div key={tile.title} className="min-w-[82vw] snap-center sm:min-w-[46%] lg:min-w-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.28, delay: index * 0.04 }}>
              <Link to={tile.link} className="ref-product-card group block h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B2034] shadow-[0_22px_70px_rgba(7,19,29,.26)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26C6E9]">
                <div className="ref-card-media aspect-[16/11] overflow-hidden bg-[#10283A]"><img src={tile.image} alt={`${tile.title} — produkt MLŽIDLA.CZ`} className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.045]" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp'; }} /></div>
                <div className="border-t border-white/10 p-5">
                  <div className="mb-3 flex items-center justify-between"><span className="ref-card-index font-mono text-[10px] font-bold text-[#26C6E9]">{String(index + 1).padStart(2, "0")}</span><span className="text-[10px] font-bold uppercase tracking-[.18em] text-white/55">Produkt</span></div>
                  <h2 className="font-heading text-2xl font-bold tracking-[-.04em] text-white">{tile.title}</h2>
                  <p className="mt-1 min-h-[40px] text-sm font-semibold leading-5 text-slate-200">{tile.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] opacity-90 transition group-hover:translate-x-1">
                    Detail produktu <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
            )}
        </div>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-white/40 sm:hidden">Přejeďte pro další produkty</p>
      </div>
    </section>
    </MotionConfig>);
}