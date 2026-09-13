import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, PlayCircle, Building2, Trees, Wifi } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';
import HeroMistDots from '@/components/home/new/HeroMistDots';

const TRUST = [
  { icon: Building2, label: 'Města a veřejný prostor' },
  { icon: Trees, label: 'Parky a promenády' },
  { icon: Wifi, label: 'Smart řízení' },
];

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HomeHero() {
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -60]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.08]);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNetwork = ['slow-2g', '2g'].includes(connection?.effectiveType);
    if (reduceMotion || connection?.saveData || slowNetwork) return undefined;

    let timeoutId;
    let idleId;
    const startVideo = () => setShouldLoadVideo(true);
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(startVideo, { timeout: 650 });
    } else {
      timeoutId = window.setTimeout(startVideo, 180);
    }
    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(21,56,99,.55)_0%,transparent_60%)]" />
      <HeroMistDots />

      <div className="relative mx-auto grid max-w-[1500px] lg:min-h-[780px] lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div style={{ y: textY }} className="relative z-20 flex items-center px-5 pb-12 pt-24 sm:px-10 sm:pb-16 sm:pt-28 lg:px-14 lg:py-28 xl:px-20">
          <div className="max-w-2xl">
            <motion.p {...fadeUp(0)} className="font-mono text-[11px] uppercase tracking-[.22em] text-accent">
              Architektonické mlžení pro města i zahrady
            </motion.p>

            <motion.h1 {...fadeUp(0.08)} className="mt-6 max-w-[12ch] font-heading text-[2.9rem] font-bold leading-[1.02] tracking-[-.035em] text-white sm:text-[clamp(3.6rem,6.4vw,6.4rem)] sm:leading-[.98]">
              Mlha, která <span className="text-accent">chladí</span> váš prostor.
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-[15px] leading-7 text-white/70 sm:text-lg">
              Nerezová mlžítka a mlžné prvky pro náměstí, parky, promenády, sportoviště, gastro i soukromé zahrady. Od návrhu a vizualizace po řízení, realizaci a servis.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link to="/poptavka" className="btn-brand-primary-dark justify-center">
                Navrhnout řešení <ArrowRight size={16} />
              </Link>
              <Link to="/mlzidla-mlzitka" className="btn-brand-outline-dark">
                Prohlédnout produkty
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.32)} className="mt-12 grid gap-2 sm:grid-cols-3">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 border-t border-white/12 pt-4 text-xs font-medium text-white/60">
                  <Icon size={15} className="shrink-0 text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-full">
          <motion.div style={{ y: mediaY, scale: mediaScale }} className="absolute inset-0 will-change-transform">
            <img
              src={VIDEO_ASSETS.heroCityPromo.poster}
              alt="Mlžítka pro ochlazování městského prostoru"
              fetchpriority="high"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
            />
            {shouldLoadVideo && !videoFailed && (
              <video
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
                autoPlay muted loop playsInline preload="metadata"
                poster={VIDEO_ASSETS.heroCityPromo.poster}
                onPlaying={() => setVideoReady(true)}
                onError={() => { setVideoFailed(true); setVideoReady(false); }}
                aria-label="Promo video MLŽIDLA pro městské ochlazování"
              >
                <source src={VIDEO_ASSETS.heroCityPromo.src} type="video/mp4" />
              </video>
            )}
          </motion.div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,.15)_0%,rgba(10,22,40,.2)_45%,rgba(10,22,40,.9)_100%)]" />
          <div className="absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-secondary via-secondary/50 to-transparent lg:block" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-secondary to-transparent lg:hidden" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-8 lg:p-10">
            <motion.div {...fadeUp(0.4)} className="flex flex-col gap-3 border border-white/12 bg-secondary/70 p-4 text-white backdrop-blur-md sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">Městské ochlazování</p>
                <h2 className="mt-2 font-heading text-xl font-bold tracking-[-.02em] sm:text-2xl">MLŽIDLA · prostor, voda, klima</h2>
                <p className="mt-1 max-w-lg text-sm leading-6 text-white/65">Promo sekvence architektonických mlžných prvků pro města, parky a veřejný prostor.</p>
              </div>
              <Link to="/reference" className="btn-brand-accent-link shrink-0 !text-white hover:!text-accent">
                <PlayCircle size={18} /> Prohlédnout realizace
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}