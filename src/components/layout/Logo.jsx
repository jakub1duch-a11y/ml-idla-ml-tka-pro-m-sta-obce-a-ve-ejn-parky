import React from 'react';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  const iconSize = compact ? 'h-9 w-9' : 'h-12 w-12';
  const wordSize = compact ? 'text-xl' : 'text-3xl';
  return <div className="inline-flex items-center gap-2.5" aria-label="MLŽIDLA by HolmTec">
    <svg viewBox="0 0 48 48" aria-hidden="true" className={`${iconSize} shrink-0 drop-shadow-[0_3px_7px_rgba(43,191,207,.28)]`}>
      <path d="M8 36V22c0-7.7 6.3-14 14-14s14 6.3 14 14v14" fill="none" stroke="#2BBFCF" strokeWidth="5" strokeLinecap="round" />
      <path d="M19 37c0-4.5 2.2-8.1 5-12 2.8 3.9 5 7.5 5 12a5 5 0 0 1-10 0Z" fill="#ffffff" />
      <circle cx="24" cy="37" r="1.5" fill="#0A1628" />
    </svg>
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className={`${wordSize} font-heading font-extrabold leading-none tracking-[0.06em]`}><span className="text-accent">MLŽ</span><span className="text-white">IDLA</span></span>
      
    </span>
  </div>;
}