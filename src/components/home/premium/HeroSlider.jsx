import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Droplets, ShieldCheck, Wifi, Wind } from 'lucide-react';

const HERO_IMAGE = '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp';

const FACTS = [
  { icon: Droplets, label: 'Jemná vodní mlha' },
  { icon: ShieldCheck, label: 'Nerezové provedení' },
  { icon: Wifi, label: 'Smart řízení' },
];

export default function HeroSlider() {
  const reduceMotion = useReducedMotion();
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    if (reduceMotion) return undefined;

    let active = true;
    const mobileQuery = window.matchMedia('(max-width: 639px)');

    const loadVideo = async () => {
      const module = mobileQuery.matches
        ? await import('@/assets/heroVideoMobile')
        : await import('@/assets/heroVideoDesktop');
      if (active) setVideoSrc(module.default);
    };

    loadVideo();
    mobileQuery.addEventListener('change', loadVideo);

    return () => {
      active = false;
      mobileQuery.removeEventListener('change', loadVideo);
    };
  }, [reduceMotion]);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#f7fbfc] text-[#0a2630]">
      {/* Horní polovina: hlavní sdělení. Globální header s logem a navigací zůstává nad hero. */}
      <div className="relative z-20 mx-auto flex min-h-[48svh] max-w-7xl items-center px-5 pb-8 pt-28 sm:px-8 sm:pb-10 lg:px-10 lg:pt-32">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4 }}
            className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#0b7c89]"
          >
            Chytřejší klima pro města i zahrady
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55, delay: .04 }}
            className="mt-4 max-w-[16ch] font-heading text-[clamp(3rem,7vw,7rem)] font-medium leading-[.9] tracking-[-.06em] text-[#0a2630]"
          >
            MLŽIDLA — chytré chlazení prostoru.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .48, delay: .12 }}
            className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-2xl text-base leading-7 text-[#48636d] sm:text-lg">
              Ochlazujeme vzduch kolem vás. Dýchejte lépe. Pro náměstí, parky, promenády, sportoviště, hotely, lázně, domovy seniorů i soukromé zahrady.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/mlzidla-mlzitka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0a2630] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#123843]">
                Objevit možnosti <ArrowRight size={16} />
              </Link>
              <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b8cbd1] bg-white px-7 py-3.5 text-sm font-semibold text-[#0a2630] transition hover:border-[#8fb6c0] hover:bg-[#f2f8fa]">
                Poptat řešení
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spodní polovina: vizuální hero, bez vložených log a textových značek. */}
      <div className="relative min-h-[52svh] overflow-hidden bg-[#071d26] sm:min-h-[56svh]">
        <video
          key={videoSrc || 'hero-poster'}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_IMAGE}
          aria-label="Nerezové mlžítko v letním prostoru s jemnou vodní mlhou"
        >
          {videoSrc && <source src={videoSrc} type="video/webm" />}
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,38,.05)_0%,rgba(7,29,38,.12)_45%,rgba(7,29,38,.72)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f7fbfc]/90 via-[#f7fbfc]/25 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[52svh] max-w-7xl items-end justify-between gap-6 px-5 pb-7 sm:min-h-[56svh] sm:px-8 sm:pb-10 lg:px-10">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {FACTS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-[#061b24]/45 px-3 py-2 text-xs text-white/86 backdrop-blur-md">
                <Icon size={14} className="text-[#8be5ef]" /> {label}
              </span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .55, delay: .35 }}
            className="hidden items-center gap-3 rounded-xl border border-[#8be5ef]/25 bg-[#071d26]/58 px-4 py-3 backdrop-blur-md lg:flex"
          >
            <Wind size={20} className="text-[#8be5ef]" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8be5ef]">Příjemnější mikroklima</p>
              <p className="text-sm font-medium text-white">Jemná mlha přímo v místě, kde ji potřebujete</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
