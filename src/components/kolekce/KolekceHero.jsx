import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import HeroBackgroundVideo from '@/components/ui/HeroBackgroundVideo';

const SCENES = [
  { name: 'BENDY', image: '/media/optimized/31478e4b3_bendymlzitko02.webp', video: '/media/optimized/78cf9a6c8_KolekceBendy_20260812_121335_0000.webm', href: '/produkt/mlzitko-bendy' },
  { name: 'MRAK', image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp', video: '/media/optimized/94c2b5f74_instalace-mlzitka-mrak.webm', href: '/produkt/mlzitko-mrak' },
  { name: 'Veřejný prostor', image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp', href: '/mlzitka-pro-mesta-obce' },
];

export default function KolekceHero() {
  const ref = useRef(null);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const scene = SCENES[selected];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '10%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.055]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-7%']);

  return (
    <section ref={ref} className="hero-motion-surface relative min-h-[720px] bg-[#07131D] text-white" aria-label="Katalog mlžítek">
      <motion.div className="absolute inset-0" style={{ y: mediaY, scale: mediaScale }}>
        <motion.img
          key={scene.image}
          src={scene.image}
          alt={scene.name}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-75"
          fetchPriority="high"
          initial={reduced ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 0.75, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        {scene.video && <HeroBackgroundVideo key={scene.video} src={scene.video} poster={scene.image} />}
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_28%,rgba(122,225,239,.16),transparent_30%),linear-gradient(90deg,rgba(7,19,29,.96)_0%,rgba(7,19,29,.78)_42%,rgba(7,19,29,.24)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#07131D] to-transparent" />
      <HeroAtmosphere />

      <motion.div style={{ y: copyY }} className="hero-catalog-content !min-h-[720px]">
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/12 bg-white/[.055] px-4 py-2 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#7AE1EF] shadow-[0_0_18px_rgba(122,225,239,.8)]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-white/62">KATALOG / MLŽIDLA®</span>
        </div>

        <h1 className="mt-6 !max-w-[10ch] !font-black !leading-[.93] !tracking-[-.06em]">
          Vyberte mlžítko podle prostoru.
        </h1>
        <p className="mt-6 !max-w-2xl !text-base !leading-8 !text-white/62 sm:!text-lg">
          Sloupková mlžítka, mlžné brány a ateliérové prvky pro města, parky, sportoviště, školy, gastro i soukromé zahrady. Katalog můžete filtrovat podle prostoru a produktové řady.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#catalog" className="catalog-sweep inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#7AE1EF] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-[#07131D] shadow-[0_18px_52px_rgba(122,225,239,.2)] transition hover:-translate-y-0.5 hover:bg-white">
            Otevřít katalog <ArrowRight size={17} aria-hidden="true" />
          </a>
          <Link to={scene.href} className="catalog-sweep inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/16 bg-white/[.06] px-6 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#7AE1EF]/45">
            {selected === 2 ? 'Řešení pro města' : 'Detail ' + scene.name} <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="hero-scene-nav !mt-8" aria-label="Scéna katalogu">
          {SCENES.map((item, index) => (
            <motion.button
              key={item.name}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.96 }}
            >
              <span className="mr-2 font-mono text-[9px] opacity-45">0{index + 1}</span>{item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
