import React, { useEffect, useState } from 'react';

export default function StoryImageCrossfade({ images, alt }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    images.forEach((src) => { const image = new Image(); image.src = src; });
    if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), 6000);
    return () => window.clearInterval(timer);
  }, [images]);
  return <div className="absolute inset-0 bg-slate-950">{images.map((src, index) => <img key={src} src={src} alt={`${alt} – ${index + 1}`} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === active ? 'opacity-80' : 'opacity-0'}`} loading={index ? 'lazy' : 'eager'} />)}</div>;
}