import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import HeroBackgroundVideo from '@/components/ui/HeroBackgroundVideo';

const SCENES = [
  { name: 'BENDY', image: '/media/optimized/31478e4b3_bendymlzitko02.webp', video: '/media/optimized/78cf9a6c8_KolekceBendy_20260812_121335_0000.webm', href: '/produkt/mlzitko-bendy' },
  { name: 'MRAK', image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp', video: '/media/optimized/94c2b5f74_instalace-mlzitka-mrak.webm', href: '/produkt/mlzitko-mrak' },
  { name: 'Veřejný prostor', image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp', href: '/mlzitka-pro-mesta-obce' },
];

export default function KolekceHero() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const scene = SCENES[selected];
  return <section className="hero-motion-surface bg-[#07131D] text-white" aria-label="Katalog mlžítek">
    <motion.img key={scene.image} src={scene.image} alt={scene.name}
      className="absolute inset-0 h-full w-full object-contain object-right opacity-80"
      fetchPriority="high" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 0.8 }}
      transition={{ duration: reduced ? 0 : 0.45 }} />
    {scene.video && <HeroBackgroundVideo key={scene.video} src={scene.video} poster={scene.image} />}
    <div className="absolute inset-0 bg-gradient-to-r from-[#07131D] via-[#07131D]/80 to-[#07131D]/20" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#07131D] via-transparent to-[#07131D]/20" />
    <HeroAtmosphere />
    <motion.div className="hero-catalog-content" initial={reduced ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
      <p className="!text-xs font-mono uppercase tracking-[.2em] !text-[#7AE1EF]">Katalog MLŽIDLA® · Česká výroba</p>
      <h1 className="mt-5">Najděte tvar.<br />Proměňte atmosféru.</h1>
      <p className="mt-6">Mlžítka a mlžné brány pro města, parky i zahrady. Prohlédněte si jednotlivé produkty a představte si jemnou mlhu ve svém prostoru.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#catalog" className="catalog-sweep inline-flex min-h-12 items-center gap-3 rounded-full bg-[#7AE1EF] px-6 py-3 text-sm font-bold text-[#07131D] shadow-[0_16px_45px_rgba(122,225,239,.18)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(122,225,239,.28)]">
          Vybrat mlžítko <ArrowRight size={17} aria-hidden="true" />
        </a>
        <Link to={scene.href} className="catalog-sweep inline-flex min-h-12 items-center gap-3 rounded-full border border-white/30 bg-white/[.08] px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/[.14]">
          {selected === 2 ? 'Řešení pro města' : 'Prohlédnout ' + scene.name} <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="hero-scene-nav" aria-label="Scéna katalogu">
        {SCENES.map((item, index) => <motion.button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: 0.96 }}>{item.name}</motion.button>)}
      </div>
    </motion.div>
  </section>;
}
