import React, { useEffect, useState } from 'react';

const MEDIA = [
  { type: 'video', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2898e54a7_Svaovnukzkazive.mov' },
  { type: 'video', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/a31b6371b_instalace-mlzitka-mrak1.MOV' },
  { type: 'video', url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/6632efc0c_Mlznabrana-zivaukazkamlzeni.MOV' },
  { type: 'image', url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.jpg' },
  { type: 'image', url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3c7f3e65f_copilot_image_1784351460863.jpg' },
];

export default function MistHeroBackground() {
  const [activeMedia, setActiveMedia] = useState(() => Math.floor(Math.random() * MEDIA.length));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMedia((current) => (current + 1) % MEDIA.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {MEDIA.map((media, index) => media.type === 'video' ? <video key={media.url} src={media.url} autoPlay muted loop playsInline preload="metadata" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${index === activeMedia ? 'opacity-65' : 'opacity-0'}`} /> : <img key={media.url} src={media.url} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${index === activeMedia ? 'opacity-65' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-950/45 to-slate-950/70" />
      <span className="mist-veil mist-veil-one" />
      <span className="mist-veil mist-veil-two" />
    </div>
  );
}