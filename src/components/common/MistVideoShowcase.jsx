import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const FEATURED_VIDEO = '/media/optimized/27d926a20_MlzitkavarealuZOOPraha-zivaukazka.webm';
const FEATURED_POSTER = '/media/optimized/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.webp';

const CLIPS = [
  { url: '/media/optimized/aa11e932c_mlnbrnaGATE70.webm', caption: 'GATE70 v parku' },
  { url: '/media/optimized/78cf9a6c8_KolekceBendy_20260812_121335_0000.webm', caption: 'Kolekce BENDY' },
  { url: '/media/optimized/30dac59df_Mlzitkaostev-zivaukazkamlznystrom.webm', caption: 'OSTREV v provozu' },
  { url: '/media/optimized/ae9faa0a3_video-mlitkospiralavakci.webm', caption: 'Mlžná spirála' },
  { url: '/media/optimized/bc59d4ed7_4419E385-9A17-4EF1-AA75-90C2B12ACDE3.webm', caption: 'Mlžení zblízka' },
  { url: '/media/optimized/2dbc1232d_EFC9FCE8-7138-44C3-AAE6-246F88644813.webm', caption: 'Jemná mlha v provozu' },
  { url: '/media/optimized/858a3a3f3_1283CEC3-EA3F-42B3-9E58-3788630B07A6.webm', caption: 'Mlžná brána v akci' },
  { url: '/media/optimized/c857caa78_Efektmlhy-mlznabrana-zivynahled.webm', caption: 'Živý efekt mlžné brány' },
  { url: '/media/optimized/9f0153e3a_ml_detailvparku_01.webm', caption: 'Detail instalace v parku' },
  { url: '/media/optimized/2ffb4d391_mlzidla-mlzitkaproparkyamesta04.webm', caption: 'Městská instalace' },
  { url: '/media/optimized/feff82d99_Aura-mlzitko-video-01.webm', caption: 'AURA v provozu' },
  { url: '/media/optimized/c7c9d3e68_video_20260619_164025.webm', caption: 'Atmosféra jemné mlhy' },
];

function DeferredVideo({ src, poster, className, autoPlayWhenVisible = false, controls = false }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        setInView(true);
      } else {
        setInView(false);
      }
    }, { rootMargin: '280px 0px', threshold: 0.04 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !autoPlayWhenVisible || reduceMotion) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [autoPlayWhenVisible, inView, reduceMotion, shouldLoad]);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        controls={controls}
        preload="none"
        className={className}
      />
    </div>
  );
}

export default function MistVideoShowcase() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Video galerie</p>
            <h2 className="max-w-2xl font-heading text-[clamp(2rem,7vw,2.7rem)] leading-[1.06] tracking-[-0.035em] text-foreground">Mlžítka v reálném prostoru</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Videa se načítají až ve chvíli, kdy se k nim návštěvník přiblíží. Stránka tak zůstává rychlá i s větší knihovnou záběrů.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .42 }} className="mb-5 overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-lg sm:mb-6 sm:rounded-3xl">
          <DeferredVideo src={FEATURED_VIDEO} poster={FEATURED_POSTER} autoPlayWhenVisible className="aspect-video w-full object-cover" />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {CLIPS.map((clip, i) => (
            <motion.button
              key={clip.url}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .08 }}
              transition={{ delay: Math.min(i * .025, .14), duration: .35 }}
              onClick={(event) => {
                const video = event.currentTarget.querySelector('video');
                if (!video) return;
                if (video.paused) video.play().catch(() => {});
                else video.pause();
              }}
              onMouseEnter={(event) => event.currentTarget.querySelector('video')?.play().catch(() => {})}
              onMouseLeave={(event) => event.currentTarget.querySelector('video')?.pause()}
              className="group relative overflow-hidden rounded-xl border border-border bg-slate-950 text-left shadow-sm sm:rounded-2xl"
              aria-label={`Přehrát video: ${clip.caption}`}
            >
              <DeferredVideo src={clip.url} className="aspect-[4/3] w-full object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-8">
                <p className="text-xs font-medium text-white">{clip.caption}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
