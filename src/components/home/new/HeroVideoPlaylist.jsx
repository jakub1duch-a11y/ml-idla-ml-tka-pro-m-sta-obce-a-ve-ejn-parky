import React, { useEffect, useState } from 'react';
import { HERO_FALLBACK } from '@/components/home/new/heroSlides';
import useHeroVideo, { playHeroVideo } from '@/components/home/new/useHeroVideo';

export { HERO_SLIDES } from '@/components/home/new/heroSlides';

export default function HeroVideoPlaylist({ slide, running, videoEnabled, videoRef, onStatus, onNext }) {
  const [revealed, setRevealed] = useState(false);
  const video = slide.type === 'video';
  useHeroVideo(videoRef, slide.src, running && videoEnabled, onStatus);
  useEffect(() => {
    onStatus(video && videoEnabled ? 'loading' : 'photo');
  }, [video, videoEnabled, onStatus]);

  return (
    <div className="hero-media-frame" data-no-watermark="true">
      <img src={slide.poster} alt={slide.label} width="1600" height="1000" loading="eager" fetchPriority="high" decoding="async"
        onLoad={() => { if (!video) onStatus('photo'); }}
        onError={(event) => { if (event.currentTarget.dataset.fallback) return; event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = HERO_FALLBACK; }} />
      {video && <video ref={videoRef} src={videoEnabled ? slide.src : undefined} poster={slide.poster}
        muted playsInline autoPlay={running && videoEnabled} preload={videoEnabled ? 'auto' : 'none'}
        aria-hidden="true" tabIndex={-1} disablePictureInPicture data-visible={revealed}
        onCanPlay={() => { if (running && videoEnabled) playHeroVideo(videoRef.current, onStatus); }}
        onPlaying={() => { setRevealed(true); onStatus('playing'); }}
        onEnded={() => { if (running) onNext(); }}
        onError={() => { setRevealed(false); onStatus('error'); }} />}
    </div>
  );
}