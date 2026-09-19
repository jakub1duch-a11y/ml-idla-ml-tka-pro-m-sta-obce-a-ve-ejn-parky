import React from 'react';

function MistMark({ compact = false }) {
  const size = compact ? 34 : 42;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <linearGradient id="mlz-mark-gradient" x1="8" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path d="M8 36V24C8 14.06 15.16 7 24 7s16 7.06 16 17v12" stroke="url(#mlz-mark-gradient)" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M13.5 36V24.3C13.5 17.68 18.08 12.5 24 12.5s10.5 5.18 10.5 11.8V36" stroke="rgba(255,255,255,.42)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="15" cy="17" r="1.5" fill="#A5F3FC" className="motion-safe:animate-[mlzDrop_4s_ease-in-out_infinite]" />
      <circle cx="24" cy="12.5" r="1.5" fill="#A5F3FC" className="motion-safe:animate-[mlzDrop_4s_ease-in-out_.35s_infinite]" />
      <circle cx="33" cy="17" r="1.5" fill="#A5F3FC" className="motion-safe:animate-[mlzDrop_4s_ease-in-out_.7s_infinite]" />
      <circle cx="19" cy="23" r="1" fill="#67E8F9" opacity=".62" />
      <circle cx="24" cy="25.5" r=".9" fill="#67E8F9" opacity=".45" />
      <circle cx="29" cy="23" r="1" fill="#67E8F9" opacity=".62" />
      <path d="M5 40H43" stroke="rgba(255,255,255,.26)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="8" cy="36" r="1.4" fill="#22D3EE" />
      <circle cx="40" cy="36" r="1.4" fill="#22D3EE" />
    </svg>
  );
}

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <span className="group/mlz-logo inline-flex items-center gap-2.5 select-none" aria-label="MLŽIDLA.cz — chytré mlžení by HolmTec">
      <span className="relative flex items-center justify-center transition-transform duration-500 ease-out motion-safe:group-hover/mlz-logo:-translate-y-0.5">
        <MistMark compact={compact} />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="flex items-baseline whitespace-nowrap">
          <span className={`${compact ? 'text-[19px]' : 'text-[24px]'} font-heading font-semibold tracking-[-0.055em] text-white transition-[letter-spacing] duration-500 motion-safe:group-hover/mlz-logo:tracking-[-0.035em]`}>
            MLŽIDLA
          </span>
          <span className={`${compact ? 'ml-1 text-[10px]' : 'ml-1.5 text-[11px]'} font-semibold tracking-[-0.02em] text-cyan-300`}>
            .cz
          </span>
        </span>
        <span className={`${compact ? 'mt-1 text-[6px] tracking-[.2em]' : 'mt-1.5 text-[7px] tracking-[.22em]'} whitespace-nowrap font-mono font-medium uppercase text-white/52`}>
          chytré mlžení · by HolmTec
        </span>
      </span>
    </span>
  );
}
