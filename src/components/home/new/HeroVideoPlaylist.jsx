import React from 'react';

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

export default function HeroVideoPlaylist({ index, onNext, poster, className }) {
  const slide = HERO_SLIDES[index];
  return (
    <video key={slide.src} src={slide.src} poster={poster} autoPlay muted playsInline preload="auto"
      aria-hidden="true" onEnded={onNext} onError={onNext} className={`${className} animate-in fade-in duration-700`} />
  );
}