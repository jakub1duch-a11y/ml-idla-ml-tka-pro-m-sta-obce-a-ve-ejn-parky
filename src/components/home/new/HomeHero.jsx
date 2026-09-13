import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Building2, Trees, Wifi, Droplets, ThermometerSnowflake } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export default function HomeHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  const reduceMotion = useReducedMotion();
  const [duration, setDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.30], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.30], [0, -36]);

  const cityOpacity = useTransform(scrollYProgress, [0.20, 0.34, 0.52, 0.62], [0, 1, 1, 0]);
  const cityY = useTransform(scrollYProgress, [0.20, 0.40, 0.62], [34, 0, -30]);

  const techOpacity = useTransform(scrollYProgress, [0.50, 0.64, 0.78, 0.86], [0, 1, 1, 0]);
  const techY = useTransform(scrollYProgress, [0.50, 0.68, 0.86], [34, 0, -28]);

  const ctaOpacity = useTransform(scrollYProgress, [0.78, 0.90, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.78, 0.93], [34, 0]);

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slow = ['slow-2g', '2g'].includes(connection?.effectiveType);
    setAllowVideo(!reduceMotion && !connection?.saveData && !slow);
  }, [reduceMotion]);

  useEffect(() => {
    if (!allowVideo || !duration || videoFailed) return undefined;

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const safeDuration = Math.max(0, duration - 0.06);
      targetTimeRef.current = clamp(progress) * safeDuration;
    });

    const tick = () => {
      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.readyState >= 2) {
        const target = targetTimeRef.current;
        const current = currentTimeRef.current;
        const delta = target - current;
        const next = Math.abs(delta) < 0.012 ? target : current + delta * 0.16;

        if (Math.abs(next - video.currentTime) > 0.01) {
          try {
            video.currentTime = next;
            currentTimeRef.current = next;
          } catch {
            // Browser can temporarily reject seeks while media state changes.
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [allowVideo, duration, videoFailed, scrollYProgress]);

  const sectionClass = useMemo(
    () => (allowVideo ? 'relative h-[300svh] sm:h-[340vh]' : 'relative h-[100svh] min-h-[700px]'),
    [allowVideo]
  );

  return (
    <section ref={sectionRef} className={`${sectionClass} bg-[#071725] text-white`} aria-label="HolmTec městské ochlazování">
      <div className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden bg-[#071725]">
        <motion.div style={{ scale: reduceMotion ? 1 : mediaScale }} className="absolute inset-0 will-change-transform">
          <img
            src={VIDEO_ASSETS.heroCityPromo.poster}
            alt="HolmTec mlžná zóna pro ochlazování městského prostoru"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
          />

          {allowVideo && !videoFailed && (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              muted
              playsInline
              preload="auto"
              poster={VIDEO_ASSETS.heroCityPromo.poster}
              aria-label="Scroll animace městské mlžné zóny HolmTec"
              onLoadedMetadata={(event) => {
                const media = event.currentTarget;
                setDuration(media.duration || 0);
                try {
                  media.currentTime = 0.01;
                  currentTimeRef.current = 0.01;
                } catch {
                  currentTimeRef.current = 0;
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
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,17,28,.92)_0%,rgba(5,17,28,.66)_34%,rgba(5,17,28,.16)_68%,rgba(5,17,28,.32)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,16,27,.24)_0%,rgba(4,16,27,.06)_42%,rgba(4,16,27,.72)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_44%_at_76%_46%,rgba(90,204,234,.18)_0%,transparent_68%)]" />

        <div className="pointer-events-none absolute -left-[12vw] top-[16%] h-[46vw] w-[46vw] max-h-[650px] max-w-[650px] rounded-full border border-cyan-200/15 bg-cyan-200/[0.035] blur-[1px]" />
        <div className="pointer-events-none absolute right-[8%] top-[10%] h-40 w-40 rounded-full border border-white/10 bg-white/[0.025] backdrop-blur-[2px] sm:h-64 sm:w-64" />

        <div className="absolute left-0 right-0 top-0 z-40 h-[3px] bg-white/10">
          <motion.div style={{ width: progressWidth }} className="h-full bg-cyan-300" />
        </div>

        <div className="relative z-20 mx-auto h-full max-w-[1500px] px-5 sm:px-10 lg:px-14 xl:px-20">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute left-5 top-[18%] max-w-3xl sm:left-10 sm:top-[20%] lg:left-14 xl:left-20">
            <p className="font-mono text-[10px] uppercase tracking-[.24em] text-cyan-300 sm:text-xs">HolmTec · městské ochlazování</p>
            <h1 className="mt-5 max-w-[11ch] font-heading text-[clamp(3.15rem,8.8vw,8.4rem)] font-bold leading-[.88] tracking-[-.055em] text-white">
              Město, které <span className="text-cyan-300">dýchá.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-xl sm:leading-8">
              Architektonická mlžítka a mlžné zóny pro příjemnější veřejný prostor v horkých dnech.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/poptavka" className="btn-brand-primary-dark pointer-events-auto justify-center">
                Navrhnout mlžnou zónu <ArrowRight size={16} />
              </Link>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs text-white/60 backdrop-blur-md">
                Scrollujte pro příběh ↓
              </span>
            </div>
          </motion.div>

          <motion.div style={{ opacity: cityOpacity, y: cityY }} className="absolute left-5 top-[26%] max-w-xl sm:left-10 lg:left-14 xl:left-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#071725]/55 px-3 py-1.5 text-xs text-cyan-200 backdrop-blur-lg">
              <Building2 size={14} /> Veřejný prostor
            </div>
            <h2 className="mt-5 font-heading text-[clamp(2.6rem,6vw,5.7rem)] font-bold leading-[.95] tracking-[-.045em]">
              Osvěžení přímo tam, kde je potřeba.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
              Jemná vodní mlha vytváří lokální komfortní zónu na náměstích, promenádách, v parcích a u frekventovaných pěších tras.
            </p>
            <div className="mt-7 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
              {[['Náměstí', Building2], ['Parky', Trees], ['Smart řízení', Wifi]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 border-t border-white/15 pt-3 text-xs font-medium text-white/65">
                  <Icon size={14} className="text-cyan-300" /> {label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ opacity: techOpacity, y: techY }} className="absolute bottom-[19%] right-5 max-w-xl text-left sm:right-10 lg:right-14 xl:right-20">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300 sm:text-xs">Voda · klima · řízení</p>
            <h2 className="mt-4 font-heading text-[clamp(2.3rem,5vw,4.9rem)] font-bold leading-[.96] tracking-[-.04em]">
              Chytré mlžení bez zbytečné složitosti.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg">
              Nízkotlaký systém napojený na vodovodní řad může doplnit automatické řízení podle času, teploty nebo bezkontaktního senzoru.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-2 backdrop-blur"><Droplets size={14} className="text-cyan-300" /> jemná mlha</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-2 backdrop-blur"><ThermometerSnowflake size={14} className="text-cyan-300" /> ochlazení prostoru</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-2 backdrop-blur"><Wifi size={14} className="text-cyan-300" /> SUPLA / smart</span>
            </div>
          </motion.div>

          <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="absolute inset-x-5 bottom-[10%] sm:inset-x-10 lg:inset-x-14 xl:inset-x-20">
            <div className="max-w-2xl border border-white/15 bg-[#071725]/68 p-5 backdrop-blur-xl sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[.23em] text-cyan-300">Od návrhu po realizaci</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-.035em] sm:text-5xl">Vytvořme příjemnější místo.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">Pošlete nám prostor. Navrhneme vhodný typ mlžení, rozmístění prvků a další postup.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/poptavka" className="btn-brand-primary-dark pointer-events-auto justify-center">Nezávazně poptat <ArrowRight size={16} /></Link>
                <Link to="/reference" className="btn-brand-outline-dark pointer-events-auto">Prohlédnout realizace</Link>
              </div>
            </div>
          </motion.div>
        </div>

        {!allowVideo && (
          <div className="absolute bottom-4 right-4 z-30 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] text-white/55 backdrop-blur">
            Statická verze pro úsporu dat / omezení pohybu
          </div>
        )}
      </div>
    </section>
  );
}
