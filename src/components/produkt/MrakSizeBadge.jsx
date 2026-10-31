import React from 'react';

const MRAK_SIZES = {
  'mlzny-mrak-1480': { code: 'S', label: 'Malý' },
  'mlzny-mrak-1413': { code: 'M', label: 'Střední' },
  'mlzny-mrak-1414': { code: 'M', label: 'Střední' },
  'mlzny-mrak-2424': { code: 'L', label: 'Velký' },
};

export function getMrakSize(slug) {
  return MRAK_SIZES[slug] || null;
}

export default function MrakSizeBadge({ slug, className = '' }) {
  const size = getMrakSize(slug);
  if (!size) return null;
  return (
    <span aria-label={`Velikost: ${size.label}`} className={`pointer-events-none inline-flex items-center gap-2 rounded-full border border-white/80 bg-[#153863]/95 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-sm ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-mono text-xs font-extrabold text-[#153863]">{size.code}</span>
      <span className="pr-1 text-[11px] font-bold uppercase tracking-[.1em]">{size.label}</span>
    </span>
  );
}
