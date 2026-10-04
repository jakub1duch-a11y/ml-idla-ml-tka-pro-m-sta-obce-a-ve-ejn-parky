import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function AutoPlayVideoPreview({
  src,
  poster = '',
  className = '',
  videoClassName = '',
  threshold = 0.55,
  controls = false,
  loop = true,
  muted = true,
  label = 'Video produktu',
  showBadge = true,
  showLoadingBackground = true,
  onClick,
}) {
  const ref = useRef(null);
  const previewId = useRef(`video-preview-${Math.random().toString(36).slice(2)}`);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const saveData = navigator.connection?.saveData;

    const pause = () => {
      video.pause();
      setPlaying(false);
    };

    const play = () => {
      if (reducedMotion || saveData) return;
      window.dispatchEvent(new CustomEvent('mlzidla:video-preview-play', { detail: { id: previewId.current } }));
      const promise = video.play();
      if (promise?.then) {
        promise.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };

    const pauseForOtherPreview = (event) => {
      if (event.detail?.id !== previewId.current) pause();
    };
    window.addEventListener('mlzidla:video-preview-play', pauseForOtherPreview);

    if (!('IntersectionObserver' in window)) {
      play();
      return () => {
        window.removeEventListener('mlzidla:video-preview-play', pauseForOtherPreview);
        pause();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) play();
        else pause();
      },
      { threshold: [0, threshold, 0.8, 1], rootMargin: '100px 0px' },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      window.removeEventListener('mlzidla:video-preview-play', pauseForOtherPreview);
      pause();
    }; 
  }, [src, threshold]);

  if (!src || failed) return null;

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        controls={controls}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        aria-label={label}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime === 0) {
            try { video.currentTime = Math.min(0.08, Math.max(0.01, video.duration * 0.01)); } catch { /* browser seek unsupported */ }
          }
        }}
        onLoadedData={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'} ${videoClassName}`}
      />
      {!ready && showLoadingBackground && <div className="absolute inset-0 bg-[linear-gradient(135deg,#e9f5fa,#d7ebf4)]" />}
      {showBadge && !controls && (
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-black/38 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white backdrop-blur-md">
          <Play size={11} fill="currentColor" /> {playing ? 'Přehrává se' : 'Video'}
        </span>
      )}
    </div>
  );
}
