import React from 'react';

// Nový MLŽIDLA® symbol: kapka + tekuté písmeno Ž. SVG zůstává ostré na mobilu i Retina displejích.
export function MistZMark({ size = 'md', className = '' }) {
  const sizes = {
    xs: 'h-7 w-[22px]',
    sm: 'h-9 w-[28px]',
    md: 'h-11 w-[35px]',
    lg: 'h-14 w-[44px]',
  };

  return (
    <svg
      viewBox="0 0 64 92"
      fill="none"
      aria-hidden="true"
      className={`${sizes[size] || sizes.md} shrink-0 overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id="mlz-z-ribbon" x1="12" y1="17" x2="55" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8F0FF" />
          <stop offset="0.24" stopColor="#00B7FF" />
          <stop offset="0.58" stopColor="#0878E8" />
          <stop offset="0.82" stopColor="#00C6FF" />
          <stop offset="1" stopColor="#7DD3FC" />
        </linearGradient>
        <linearGradient id="mlz-drop" x1="22" y1="1" x2="42" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C6FF" />
          <stop offset="0.6" stopColor="#0097F5" />
          <stop offset="1" stopColor="#0A5ED7" />
        </linearGradient>
        <filter id="mlz-soft-glow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g className="mlz-logo-drop" filter="url(#mlz-soft-glow)">
        <path d="M32 2C32 2 20.2 15.8 20.2 23.1C20.2 29.7 25.5 35 32 35C38.5 35 43.8 29.7 43.8 23.1C43.8 15.8 32 2 32 2Z" fill="url(#mlz-drop)" />
        <ellipse cx="27.4" cy="18.4" rx="3.7" ry="7" fill="white" opacity=".52" transform="rotate(28 27.4 18.4)" />
      </g>

      <g className="mlz-logo-ribbon" filter="url(#mlz-soft-glow)">
        <path d="M13 39.5C13 36.7 15.2 34.5 18 34.5H52C52 41.7 49.1 47.3 43.8 52.2L27 67.8C23.8 70.8 23.1 74.5 25.3 77.5C27 79.8 29.9 81 34 81H53.5L58 87H30.2C21.7 87 15.8 84.2 12.8 79.2C9 72.9 11.2 65 18.6 58.4L36.8 42.2H18C15.2 42.2 13 41.7 13 39.5Z" fill="url(#mlz-z-ribbon)" />
        <path d="M36.8 42.2H18C15.2 42.2 13 40.1 13 37.4V34.5H52C52 38.1 51.2 41.3 49.5 44.2C45.3 46.4 40.2 46.2 36.8 42.2Z" fill="#8DEBFF" opacity=".58" />
        <path d="M20.8 58.7C26.6 53.8 33.2 49.7 39.5 44.7C33.8 52.4 27.1 59.7 21.7 66.3C17.9 71 17.7 76 21.8 80.8C13.6 77.2 13.3 67.1 20.8 58.7Z" fill="white" opacity=".2" />
      </g>
    </svg>
  );
}

// Jednotné logo pro hlavičku, patičku, mobilní menu a brand manuál.
export default function Logo({ size = 'md', variant = 'simple', tone = 'dark', className = '' }) {
  const compact = size === 'sm' || size === 'xs';
  const isFull = variant === 'full';
  const textColor = tone === 'light' ? 'text-[#071A2F]' : 'text-white';
  const mutedColor = tone === 'light' ? 'text-[#071A2F]/72' : 'text-white/76';
  const wordSize = compact ? 'text-[21px] sm:text-[23px]' : size === 'lg' ? 'text-[36px] sm:text-[42px]' : 'text-[28px]';
  const markSize = compact ? 'sm' : size === 'lg' ? 'lg' : 'md';

  return (
    <span
      className={`group/mlz-logo inline-flex min-w-0 select-none flex-col ${className}`}
      aria-label="MLŽIDLA — jemná atraktivní mlha pro lepší klima"
    >
      <span className="inline-flex items-center whitespace-nowrap leading-none">
        <span className={`${wordSize} font-heading font-bold tracking-[-0.075em] ${textColor}`}>ML</span>
        <span className="mx-[0.02em] inline-flex origin-center transition-transform duration-500 ease-out motion-safe:group-hover/mlz-logo:-translate-y-[1px] motion-safe:group-hover/mlz-logo:scale-[1.025]">
          <MistZMark size={markSize} />
        </span>
        <span className={`${wordSize} font-heading font-bold tracking-[-0.075em] ${textColor}`}>IDLA</span>
        <sup className={`${compact ? 'ml-1 text-[7px]' : 'ml-1.5 text-[9px]'} self-start pt-1 font-semibold ${mutedColor}`}>®</sup>
      </span>

      {isFull && (
        <span className="mt-2.5 flex max-w-full flex-col">
          <span className={`${size === 'lg' ? 'text-base sm:text-lg' : 'text-sm'} font-medium tracking-[0.01em] ${mutedColor}`}>
            Jemná atraktivní mlha
          </span>
          <span className="mt-1.5 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[.34em] text-[#00B7FF] sm:text-[10px]">
            <span className="h-px w-5 bg-current" />
            <span>Pro lepší klima</span>
            <span className="h-px w-5 bg-current" />
          </span>
          <span className={`${size === 'lg' ? 'mt-3 text-[22px] sm:text-[26px]' : 'mt-2 text-lg'} font-brand-script leading-none text-[#16BFFF]`}>
            Architektura, která dýchá.
          </span>
        </span>
      )}
    </span>
  );
}
