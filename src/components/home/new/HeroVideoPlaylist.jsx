import React, { useState } from 'react';

const V = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/';
const F = 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/';

// Střídání reálných záběrů z realizací a AI animací.
const CLIPS = [
  V + 'aa11e932c_mlnbrnaGATE70.mp4',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3ICzICGuGqUOkZZLkzO15YACs1y/8cfbe5d4-ba39-4917-8d58-0b59ad355c18.mp4',
  F + 'a338e77cb_mlzidla---bendy-a-zahradni-instalace.mp4',
  F + '05e74ca17_aura-mlzitko-video-03.mp4',
  V + '0d9a4e147_mlznabranaGATE70-video.mp4',
  'https://d2ol7oe51mr4n9.cloudfront.net/user_3ICzICGuGqUOkZZLkzO15YACs1y/d3f82e17-eb90-47cb-ac72-6f45c7e3cfb7.mp4',
  F + 'c37b035c2_mlzidla-linea-real-video-01.mp4',
  F + 'e489c1e62_mlzitko-ostrev-video.mp4',
];

export default function HeroVideoPlaylist({ poster, className }) {
  const [i, setI] = useState(0);
  const next = () => setI((n) => (n + 1) % CLIPS.length);
  return (
    <video
      key={CLIPS[i]}
      src={CLIPS[i]}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onEnded={next}
      onError={next}
      className={className}
    />
  );
}