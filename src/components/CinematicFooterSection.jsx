import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

export default function CinematicFooterSection({
  enabled = true, height = 440, mobileHeight = 280, shade = 0.5,
  loop = true, showCTA = true,
  src = '/media/optimized/a4733f633_detailnamlhumlznebrany.webm',
  poster,
}) {
  const section = useRef(null);
  const video = useRef(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(true);
  const [manualPause, setManualPause] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update(); mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!enabled || !section.current) return;
    if (!window.IntersectionObserver) { setNear(true); setVisible(true); return; }
    const load = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: '200px' });
    const view = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    load.observe(section.current); view.observe(section.current);
    return () => { load.disconnect(); view.disconnect(); };
  }, [enabled]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (visible && !manualPause && !reduced) el.play().catch(() => setPaused(true));
    else el.pause();
  }, [visible, near, manualPause, reduced, failed]);
  if (!enabled) return null;
  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) { setManualPause(false); el.play().catch(() => setPaused(true)); }
    else { setManualPause(true); el.pause(); }
  };
  return (
    <section ref={section} aria-label="Atmosféra vodní mlhy" className="relative isolate w-full overflow-hidden bg-[#102733] text-white h-[var(--cinematic-mobile)] md:h-[var(--cinematic-desktop)]"
      style={{ '--cinematic-mobile': mobileHeight + 'px', '--cinematic-desktop': height + 'px' }}>
      {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
      {near && !failed && <video ref={video} src={src} poster={poster} muted playsInline loop={loop} preload="metadata" aria-hidden="true"
        onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onEnded={() => setPaused(true)} onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover" />}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'rgba(0,0,0,' + Math.max(0, Math.min(1, shade)) + ')' }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b2c50]/60 to-transparent" />
      {near && !failed && <button type="button" onClick={toggle} aria-label={paused ? 'Přehrát video' : 'Pozastavit video'} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-black/30 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>}
      {showCTA && <Link to="/reference" className="absolute bottom-6 right-5 inline-flex min-h-11 items-center gap-2 border-b border-white/50 px-1 text-sm font-medium text-white hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:bottom-8 md:right-10">
        Objevte realizace <ArrowUpRight size={15} />
      </Link>}
    </section>
  );
}
