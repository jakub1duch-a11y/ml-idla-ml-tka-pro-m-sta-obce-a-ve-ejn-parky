import React from 'react';

// Stejná geometrie symbolu a logotypu jako v /public/brand/official-2026.
// Vložené SVG dědí webový font Montserrat; exportní varianty pro Canva a tisk
// jsou samostatné verzované soubory ve stejném adresáři.
const ARCH = "M0 100V52C0 23.3 26.9 0 60 0s60 23.3 60 52v48H96V52c0-16.6-16.1-30-36-30S24 35.4 24 52v48H0Z";
const DROP = "M60 46c-6 9-11 15.5-11 21.5a11 11 0 0 0 22 0C71 61.5 66 55 60 46Z";

export function MlzidlaIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 120 110" className={className} fill="currentColor" aria-hidden="true">
      <g transform="translate(0 5)"><path d={ARCH} /><path d={DROP} /></g>
    </svg>
  );
}

// variant: horizontal | slogan | icon
export default function MlzidlaLogoSvg({ variant = 'horizontal', className = '', title = 'MLŽIDLA.CZ' }) {
  if (variant === 'icon') return <MlzidlaIcon className={className} />;
  const slogan = variant === 'slogan';
  return (
    <svg viewBox={`0 0 570 ${slogan ? 150 : 110}`} className={className} fill="currentColor" role="img" aria-label={title}>
      <title>{title}</title>
      <g transform="translate(3 5)"><path d={ARCH} /><path d={DROP} /></g>
      <text x="142" y="72" fontFamily="Montserrat, Inter, sans-serif" fontWeight="800" fontSize="58" letterSpacing="-1">MLŽIDLA.CZ</text>
      {slogan && <text x="144" y="108" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="17" letterSpacing="1.7">JEMNÁ ATRAKTIVNÍ MLHA</text>}
    </svg>
  );
}
