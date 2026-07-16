import React from 'react';

const VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4b5e93510_mlzitka_v_provozu_-_mlzidla_cz.mp4';

export default function MistHeroBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <video
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/90" />
      <span className="mist-veil mist-veil-one" />
      <span className="mist-veil mist-veil-two" />
    </div>
  );
}