import React, { useEffect, useState } from 'react';

const VIDEO_URLS = [
  'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2898e54a7_Svaovnukzkazive.mov',
  'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/a31b6371b_instalace-mlzitka-mrak1.MOV',
  'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/9c1af5119_Efektmlhy-mlznabrana-zivynahled.mov',
];

export default function MistHeroBackground() {
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveVideo((current) => (current + 1) % VIDEO_URLS.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {VIDEO_URLS.map((url, index) => (
        <video
          key={url}
          src={url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === activeVideo ? 'opacity-65' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-950/45 to-slate-950/70" />
      <span className="mist-veil mist-veil-one" />
      <span className="mist-veil mist-veil-two" />
    </div>
  );
}