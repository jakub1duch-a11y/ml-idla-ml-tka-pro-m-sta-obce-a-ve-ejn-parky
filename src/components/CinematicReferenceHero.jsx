import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence, motion, useReducedMotion, useScroll, useTransform,
} from 'framer-motion';
import {
  ArrowDown, ArrowLeft, Pause, Play, Share2, Volume2, VolumeX,
} from 'lucide-react';

// Native, browser-playable files only. Embedded/social videos remain in the
// existing controlled video section; they cannot reliably autoplay as a background.
const isBackgroundVideo = (url) => /^https?:\/\//i.test(url || '')
  && /\.(mp4|webm)(\?.*)?$/i.test(url || '');
const SEQUENCE_MS = 9000;
const DISSOLVE_SECONDS = 1.3;
const MAX_SEQUENCES = 5;

export default function CinematicReferenceHero({
  project, videos = [], description, isTechnicalVisual = false, title, badge,
}) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const attemptedRef = useRef(new Set());
  const clips = useMemo(
    () => [...new Set(videos.filter(isBackgroundVideo))].slice(0, MAX_SEQUENCES),
    [videos],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [inViewport, setInViewport] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const hasVideo = clips.length > 0 && !reducedMotion && !unavailable;
  const activeClip = clips[activeIndex] || null;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const scrollDarkening = useTransform(scrollYProgress, [0, 1], [0, 0.76]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.85, 0.2]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause decoding when the hero leaves the viewport or the tab is hidden.
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!hasVideo || !videoRef.current) return undefined;
    const node = videoRef.current;
    if (!playing || !inViewport || !tabVisible) {
      node.pause();
    } else {
      node.play().catch(() => setPlaying(false));
    }
    return undefined;
  }, [activeIndex, hasVideo, playing, inViewport, tabVisible]);

  // A clip can be shorter than the default sequence. onEnded advances early;
  // the timeout bounds longer clips, keeping the storytelling rhythm consistent.
  useEffect(() => {
    if (!hasVideo || clips.length < 2 || !playing || !inViewport || !tabVisible) return undefined;
    const timer = window.setTimeout(
      () => setActiveIndex((i) => (i + 1) % clips.length),
      SEQUENCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, clips.length, hasVideo, playing, inViewport, tabVisible]);

  const nextScene = () => {
    if (clips.length > 1) setActiveIndex((i) => (i + 1) % clips.length);
    else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (playing) videoRef.current.play().catch(() => setPlaying(false));
    }
  };

  const togglePlayback = () => {
    if (!hasVideo) return;
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (videoRef.current) videoRef.current.muted = nextMuted;
  };

  const shareReference = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: project.name, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
    }
  };

  return (
    <section
      ref={containerRef}
      aria-label={`Úvod realizace ${project.name}`}
      className="relative isolate h-[100svh] min-h-[620px] max-h-[1050px] overflow-hidden bg-[#061f2b] text-white"
      data-reference-cinematic-hero
    >
      {/* Real project photo stays beneath the video as an always-visible poster. */}
      {project.image_url && (
        <img
          src={project.image_url}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className={`absolute inset-0 h-full w-full ${isTechnicalVisual ? 'object-contain' : 'object-cover'}`}
        />
      )}

      {/* Each video is a full-bleed background layer, not an embedded player. */}
      <AnimatePresence initial={false}>
        {hasVideo && activeClip && (
          <motion.video
            key={activeClip}
            ref={videoRef}
            src={activeClip}
            poster={project.image_url || undefined}
            autoPlay
            muted={muted}
            playsInline
            preload="metadata"
            loop={clips.length === 1}
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: DISSOLVE_SECONDS, ease: 'easeInOut' }, scale: { duration: 8, ease: 'linear' } }}
            onPlay={() => { attemptedRef.current.clear(); }}
            onEnded={nextScene}
            onError={() => {
              attemptedRef.current.add(activeClip);
              if (attemptedRef.current.size >= clips.length) setUnavailable(true);
              else if (clips.length > 1) nextScene();
              else setUnavailable(true);
            }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#041c28]/90 via-[#041c28]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041c28]/90 via-[#041c28]/10 to-[#041c28]/25" />
      <motion.div
        style={{ opacity: scrollDarkening }}
        className="pointer-events-none absolute inset-0 bg-[#041c28]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-5 pb-7 pt-24 sm:px-8 lg:px-10 lg:pb-12 lg:pt-32">
        <Link
          to="/reference"
          className="inline-flex w-fit min-h-11 items-center gap-2 text-sm text-white/85 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Všechny realizace
        </Link>

        <motion.div style={{ opacity: headlineOpacity }} className="max-w-[900px] pb-8">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[.23em] text-cyan-200 sm:text-xs">
              MLŽIDLA® / REFERENCE / BY HOLMTEC
            </p>
            {badge && (
              <span className="rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                {badge}
              </span>
            )}
          </div>
          <h1 className="font-heading text-4xl leading-[1.06] tracking-tight drop-shadow-lg sm:text-6xl lg:text-[4.75rem]">
            {title || project.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {description}
          </p>
          {isTechnicalVisual && (
            <span className="mt-4 inline-flex bg-black/55 px-4 py-2 text-xs">
              Technický podklad · nejde o fotografii realizace
            </span>
          )}
          </motion.div>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/25 pt-4 text-xs sm:text-sm">
          <a href="#reference-story" className="inline-flex min-h-11 items-center gap-3 hover:text-cyan-200">
            <ArrowDown size={18} aria-hidden="true" /> Prozkoumat projekt
          </a>
          <div className="flex flex-wrap items-center gap-2">
            {hasVideo && (
              <>
                {clips.length > 1 && (
                  <div className="hidden items-center gap-1.5 sm:flex" aria-label={`Záběr ${activeIndex + 1} z ${clips.length}`}>
                    {clips.map((clip, index) => (
                      <span
                        key={clip}
                        className={`h-[3px] rounded-full transition-all duration-500 ${index === activeIndex ? 'w-9 bg-white' : 'w-3 bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/35 bg-black/30 backdrop-blur-sm"
                  aria-label={playing ? 'Pozastavit záběry' : 'Přehrát záběry'}
                >
                  {playing ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-black/30 px-4 backdrop-blur-sm"
                >
                  {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  {muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
                </button>
                {clips.length > 1 && (
                  <button
                    type="button"
                    onClick={nextScene}
                    className="min-h-11 rounded-full border border-white/35 bg-black/30 px-4 backdrop-blur-sm"
                    aria-label="Zobrazit další záběr"
                  >
                    Další záběr
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={shareReference}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-black/30 px-4 backdrop-blur-sm"
            >
              <Share2 size={16} aria-hidden="true" /> Sdílet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}