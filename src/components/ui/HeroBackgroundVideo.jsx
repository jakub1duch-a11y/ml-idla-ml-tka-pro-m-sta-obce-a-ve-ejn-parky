import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import './HeroAtmosphere.css';

/** Starts only after an explicit click and pauses when the scene leaves the viewport. */
export default function HeroBackgroundVideo({ src, poster, className = 'absolute inset-0 h-full w-full object-cover' }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const pause = () => video.pause();
    const visibility = () => { if (document.hidden) pause(); };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    }, { threshold: 0 });
    observer?.observe(video);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', visibility); video.pause(); };
  }, [src]);
  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) video.pause();
    else video.play().catch(() => setPlaying(false));
  };
  return <>
    <video key={src} ref={videoRef} src={src} poster={poster} muted loop playsInline preload="none"
      className={className} aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setFailed(true); setPlaying(false); }} />
    <button type="button" className="hero-video-toggle" onClick={toggle} disabled={failed}
      aria-label={playing ? 'Pozastavit video na pozadí' : 'Přehrát video na pozadí'}>
      {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      {failed ? 'Video není dostupné' : playing ? 'Pozastavit video' : 'Přehrát atmosféru'}
    </button>
  </>;
}
