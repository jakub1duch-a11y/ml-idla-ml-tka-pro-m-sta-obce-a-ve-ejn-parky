import React, { useEffect, useRef } from 'react';

const V = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/';
const F = 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/';

// Kvalitní videa: střídání reálných realizací a AI animací.
export const HERO_SLIDES = [
  { src: V + 'aa11e932c_mlnbrnaGATE70.mp4', label: 'Mlžná brána GATE · realizace' },
  { src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3ICzICGuGqUOkZZLkzO15YACs1y/8cfbe5d4-ba39-4917-8d58-0b59ad355c18.mp4', label: 'BENDY · AI animace' },
  { src: F + 'a338e77cb_mlzidla---bendy-a-zahradni-instalace.mp4', label: 'BENDY · zahradní instalace' },
  { src: V + '0d9a4e147_mlznabranaGATE70-video.mp4', label: 'GATE70 · mlžný průchod' },
  { src: F + 'c37b035c2_mlzidla-linea-real-video-01.mp4', label: 'LINEA · reálný záběr' },
  { src: F + '05e74ca17_aura-mlzitko-video-03.mp4', label: 'AURA · AI animace' },
];

// Dvojitý buffer: aktuální video hraje, další se mezitím přednačítá → plynulý přechod bez černé pauzy.
export default function HeroVideoPlaylist({ index, onNext, poster, className }) {
  const refs = useRef({});
  const next = (index + 1) % HERO_SLIDES.length;
  useEffect(() => {
    const v = refs.current[HERO_SLIDES[index].src];
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  }, [index]);
  return (
    <>
      {[index, next].map((i) => {
        const s = HERO_SLIDES[i];
        const active = i === index;
        return (
          <video key={s.src} ref={(el) => { refs.current[s.src] = el; }} src={s.src} poster={poster}
            autoPlay={active} muted playsInline preload="auto" aria-hidden="true"
            onEnded={active ? onNext : undefined} onError={active ? onNext : undefined}
            className={`${className} absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`} />
        );
      })}
    </>
  );
}