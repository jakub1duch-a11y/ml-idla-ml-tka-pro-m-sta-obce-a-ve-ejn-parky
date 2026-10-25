import { useEffect } from 'react';

export function playHeroVideo(video, report) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  // Autoplay denial is normal on battery-saving browsers; expose a real play control.
  video.play()?.catch((error) => {
    if (!video.isConnected || error.name === 'AbortError') return;
    report(error.name === 'NotAllowedError' ? 'blocked' : 'error');
  });
}

export default function useHeroVideo(ref, source, running, report) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    if (running) playHeroVideo(video, report);
    else video.pause();
    return () => video.pause();
  }, [ref, source, running, report]);
}