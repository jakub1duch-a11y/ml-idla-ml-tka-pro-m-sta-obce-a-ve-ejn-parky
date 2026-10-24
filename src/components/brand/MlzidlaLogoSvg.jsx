import React from 'react';

// Vektorové logo MLŽIDLA.CZ: oblouk (mlžná brána) + kapka. Barva přes currentColor.
export function MlzidlaIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 100V52C0 23.3 26.9 0 60 0s60 23.3 60 52v48H96V52c0-16.6-16.1-30-36-30S24 35.4 24 52v48H0Z" />
      <path d="M60 46c-6 9-11 15.5-11 21.5a11 11 0 0 0 22 0C71 61.5 66 55 60 46Z" />
    </svg>
  );
}

// variant: "horizontal" (bez sloganu) | "slogan" (se sloganem) | "icon"
export default function MlzidlaLogoSvg({ variant = 'horizontal', className = '', title = 'MLŽIDLA.CZ' }) {
  if (variant === 'icon') return <MlzidlaIcon className={className} />;
  const slogan = variant === 'slogan';
  return (
    <svg viewBox={`0 0 ${slogan ? 520 : 470} 100`} className={className} fill="currentColor" role="img" aria-label={title}>
      <title>{title}</title>
      <g transform="translate(0 0)">
        <path d="M0 100V52C0 23.3 26.9 0 60 0s60 23.3 60 52v48H96V52c0-16.6-16.1-30-36-30S24 35.4 24 52v48H0Z" />
        <path d="M60 46c-6 9-11 15.5-11 21.5a11 11 0 0 0 22 0C71 61.5 66 55 60 46Z" />
      </g>
      <text x="142" y={slogan ? 58 : 72} fontFamily="Manrope, Inter, Arial, sans-serif" fontWeight="800" fontSize={slogan ? 50 : 58} letterSpacing="-1">MLŽIDLA.CZ</text>
      {slogan && <text x="144" y="94" fontFamily="Manrope, Inter, Arial, sans-serif" fontWeight="600" fontSize="25" letterSpacing="1.5">PRO PŘÍJEMNĚJŠÍ ŽIVOT</text>}
    </svg>
  );
}