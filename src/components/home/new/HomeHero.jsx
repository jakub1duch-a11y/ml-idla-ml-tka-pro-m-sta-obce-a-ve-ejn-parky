import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import { ArrowRight, Building2, Trees, Wifi, Sparkles } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';
import HeroMistDots from '@/components/home/new/HeroMistDots';

const TRUST = [
  { icon: Building2, label: 'Města a veřejný prostor' },
  { icon: Trees, label: 'Parky a promenády' },
  { icon: Wifi, label: 'Smart řízení' },
];

const STEPS = [
  {
    kicker: 'MLŽIDLA® · Urban cooling',
    title: 'MLŽIDLA — chytré chlazení prostoru.',
    body: 'Nerezová mlžítka a mlžné brány pro města, parky, hřiště, gastro zahrádky i soukromé terasy. Navrhujeme je podle konkrétního místa, provozu a technických možností napojení.',
  },
  {
    kicker: 'Architektonické řešení',
    title: 'Čistý nerezový prvek místo rušivé technologie.',
    body: 'Tvar, kotvení i umístění řešíme tak, aby mlžítko nepůsobilo jako doplněk navíc, ale jako promyšlená součást prostoru.',
  },
  {
    kicker: 'Chytré ovládání',
    title: 'Ovládání podle času, teploty i provozu.',
    body: 'Mlžení lze doplnit o chytrý ventil, ruční ovládání nebo provozní scénáře. Konkrétní funkce vždy potvrzujeme podle zvolené konfigurace.',
  },
  {
    kicker: 'Návrh a realizace',
    title: 'Od fotografie prostoru k jasnému návrhu.',
    body: 'Pomůžeme připravit vizualizaci, technické podklady, varianty řešení a další krok pro poptávku nebo schvalování projektu.',
  },
];

export default function HomeHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  const reduceMotion = useReducedMotion();

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Astra/Scrollcraft principle: keep copy, product imagery and ambient background
  // on distinct depth planes moving at slightly different speeds.
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  const panelY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return undefined;

    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const connection = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
    const slowNetwork = ['slow-2g', '2g'].includes(connection?.effectiveType);
    const saveData = Boolean(connection?.saveData);

    if (slowNetwork || saveData) return undefined;

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(
        () => setShouldLoadVideo(true),
        { timeout: 800 },
      );

      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setShouldLoadVideo(true), 200);
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const nextStep = Math.min(STEPS.length - 1, Math.floor(clamped * STEPS.length));
    setActiveStep(nextStep);

    const video = videoRef.current;
    if (!video || !videoReady || !videoDuration || reduceMotion) return;

    const targetTime = clamped * Math.max(videoDuration - 0.05, 0);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      try {
        if (Math.abs(video.currentTime - targetTime) > 0.03) {
          video.currentTime = targetTime;
        }
      } catch {
        // Some browsers can temporarily reject seeks while media state changes.
      }
    });
  });

  const activeContent = STEPS[activeStep] ?? STEPS[0];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[205vh] bg-secondary text-secondary-foreground lg:min-h-[280vh]"
      aria-label="HolmTec městské ochlazování"
    >
      <div className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(21,56,99,.55)_0%,transparent_60%)]" />
        <HeroMistDots />

        <motion.div
          className="absolute -inset-y-[7%] inset-x-0 will-change-transform"
          style={reduceMotion ? undefined : { y: backgroundY, scale: backgroundScale }}
        >
          <img
            src={VIDEO_ASSETS.heroCityPromo.poster}
            alt="Mlžné zóny HolmTec pro ochlazování městského prostoru"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
              videoReady ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {shouldLoadVideo && !videoFailed && !reduceMotion && (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              playsInline
              preload="metadata"
              poster={VIDEO_ASSETS.heroCityPromo.poster}
              aria-label="Promo video MLŽIDLA pro městské ochlazování"
              onLoadedMetadata={(event) => {
                const media = event.currentTarget;
                setVideoDuration(Number.isFinite(media.duration) ? media.duration : 0);
                media.pause();
                try {
                  media.currentTime = 0;
                } catch {
                  // Ignore browsers that defer seeking until media is fully ready.
                }
              }}
              onCanPlay={() => setVideoReady(true)}
              onError={() => {
                setVideoFailed(true);
                setVideoReady(false);
              }}
            >
              <source src={VIDEO_ASSETS.heroCityPromo.src} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,20,.24)_0%,rgba(7,24,20,.34)_42%,rgba(7,24,20,.9)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,20,.9)_0%,rgba(7,24,20,.66)_36%,rgba(7,24,20,.18)_64%,rgba(7,24,20,.28)_100%)]" />
        </motion.div>

        <div className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-[1400px] px-5 pt-5 sm:px-8 lg:px-12">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-accent"
              style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
            />
          </div>
        </div>

        <motion.div
          className="relative z-20 mx-auto flex h-full w-full max-w-[1500px] items-center px-5 sm:px-8 lg:px-12 xl:px-20"
          style={reduceMotion ? undefined : { y: contentY }}
        >
          <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-2xl self-center pt-24 sm:pt-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[.22em] text-accent">
                    {activeContent.kicker}
                  </p>

                  <h1 className="mt-6 max-w-[12ch] font-heading text-[2.8rem] font-bold leading-[1.02] tracking-[-.04em] text-white sm:text-[clamp(3.5rem,6.2vw,6.2rem)] sm:leading-[.98]">
                    {activeContent.title}
                  </h1>

                  <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/[0.86] sm:text-lg">
                    {activeContent.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                <Link to="/poptavka" className="btn-brand-primary-dark justify-center">
                  Navrhnout řešení <ArrowRight size={16} />
                </Link>
                <Link to="/reference" className="btn-brand-outline-dark">
                  Prohlédnout realizace
                </Link>
              </div>

              <div className="mt-12 grid gap-2 sm:grid-cols-3">
                {TRUST.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 border-t border-white/[0.18] pt-4 text-xs font-semibold text-white/78"
                  >
                    <Icon size={15} className="shrink-0 text-accent" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              className="hidden lg:flex lg:justify-end lg:pb-14"
              style={reduceMotion ? undefined : { y: panelY }}
            >
              <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-white/[0.08] p-5 text-white backdrop-blur-xl">
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">
                  MLŽIDLA v prostoru
                </p>
                <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-.03em]">
                  Návrh, výroba a řízení v jednom procesu
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/82">
                  Každý projekt stavíme kolem skutečného prostoru, reálného provozu a ověřené geometrie produktu. Nejasné technické údaje označujeme k potvrzení.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-2 text-[11px] font-semibold text-white/88">
                    <Sparkles size={14} className="text-accent" /> český návrh a výroba
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/12 px-3 py-2 text-[11px] font-semibold text-white/88">
                    veřejný prostor · rezidence
                  </span>
                </div>

                <Link
                  to="/mlzidla-mlzitka"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white"
                >
                  Zobrazit produkty <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 border border-white/[0.12] bg-secondary/[0.55] p-4 text-white backdrop-blur-md sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-accent">
                HolmTec · mlžné systémy
              </p>
              <h3 className="mt-2 font-heading text-xl font-bold tracking-[-.02em] sm:text-2xl">
Chytré mlžení pro města, zahrady a veřejné prostory
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/82">
                Čisté nerezové tvary, skryté kotvení a ovládání podle provozu.
              </p>
            </div>

            <Link
              to="/kontakt"
              className="btn-brand-accent-link shrink-0 !text-white hover:!text-accent"
            >
              Kontaktovat tým <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
