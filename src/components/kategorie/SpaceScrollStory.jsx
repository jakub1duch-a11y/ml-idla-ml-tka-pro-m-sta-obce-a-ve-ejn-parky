import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const stories = {
  schools: {
    eyebrow: 'ŠKOLNÍ ZAHRADY · VENKOVNÍ POBYT',
    heading: 'Prostor, ve kterém je příjemné být.',
    text: 'Nejprve místo a jeho využití. Potom výběr skutečného mlžítka, provozního režimu a vhodného napojení.',
    poster: '/media/hero-posters/deti.webp',
    video: '/media/optimized/e557b652c_generated_video.webm',
    steps: [
      ['01 / PROSTOR', 'Zahrada a školní dvůr', 'Zohledníme dohled, pohyb dětí, povrchy a přívod vody.'],
      ['02 / MLŽENÍ', 'Jemná mlha v kontextu', 'Ukážeme použití ověřených modelů v konkrétním prostoru.'],
      ['03 / REALIZACE', 'Návrh podle místa', 'Prověříme provoz, hygienu, kotvení a údržbu.'],
    ],
  },
  parks: {
    eyebrow: 'PARKY · POBYTOVÉ ZÓNY',
    heading: 'Přirozená součást veřejného prostoru.',
    text: 'Parkové mlžítko navrhujeme podle místa, návštěvnosti, přívodu vody a skutečné geometrie výrobku.',
    poster: '/media/hero-posters/parkyhriste.webp',
    video: '/media/optimized/3c3e64d18_generated_video.webm',
    steps: [
      ['01 / MÍSTO', 'Cesta, lavička nebo pobytová plocha', 'Vybereme polohu s ohledem na okolní zeleň a provoz.'],
      ['02 / ATMOSFÉRA', 'Voda a nerezový tvar', 'Představíme mlžení pouze na skutečném ověřeném modelu.'],
      ['03 / NÁVRH', 'Od záměru k realizaci', 'Upřesníme instalaci, řízení, údržbu a podmínky provozu.'],
    ],
  },
};

export default function SpaceScrollStory({ variant = 'schools' }) {
  const data = stories[variant] || stories.schools;
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !motionEnabled || !ref.current) { video?.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); video.pause(); };
  }, [reduced, motionEnabled]);
  return (
    <section ref={ref} aria-label={data.heading} className="relative bg-[#071c28] text-white lg:h-[260vh]">
      <div className="relative isolate overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:min-h-[620px]">
        <motion.div className="absolute inset-0" style={reduced || !motionEnabled ? {} : { scale }}>
          <img src={data.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
          <video ref={videoRef} aria-hidden="true" muted loop playsInline preload="none" poster={data.poster} className={`absolute inset-0 h-full w-full object-cover motion-reduce:hidden ${!motionEnabled ? "hidden" : ""}`}>
            <source src={data.video} type="video/webm" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#071c28]/95 via-[#071c28]/75 to-[#071c28]/30" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-6 py-20 lg:h-full lg:min-h-0 lg:px-10">
          <p className="mb-5 text-xs font-semibold tracking-[.2em] text-cyan-200">{data.eyebrow}</p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{data.heading}</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">{data.text}</p>
          <div className="mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {data.steps.map(([number, title, description], i) => (
              <motion.div key={number} initial={reduced ? false : { opacity: 0.55, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.4, once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/20 bg-slate-950/55 p-5 backdrop-blur-md">
                <p className="mb-3 text-xs tracking-widest text-cyan-200">{number}</p>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-200">{description}</p>
              </motion.div>
            ))}
          </div>
          {!reduced && <button type="button" onClick={() => setMotionEnabled(value => !value)} className="mt-6 w-fit rounded-full border border-white/50 px-5 py-2 text-sm text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" aria-pressed={!motionEnabled}>{motionEnabled ? "Pozastavit animaci" : "Spustit animaci"}</button>}
          <a href="#poptavka" className="mt-8 inline-flex w-fit items-center rounded-full bg-cyan-200 px-7 py-3.5 font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Navrhnout řešení pro tento prostor</a>
        </div>
      </div>
    </section>
  );
}
