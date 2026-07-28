import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return <div className="inline-flex h-full items-center gap-2 whitespace-nowrap leading-none text-white"><Link to="/" aria-label="Mlžidla.cz" className={`${compact ? 'text-2xl sm:text-3xl xl:text-[2rem]' : 'text-3xl sm:text-4xl'} font-heading font-semibold tracking-tight`}><span className="text-cyan">mlž</span>idla</Link><a href="https://holmtec.cz" target="_blank" rel="noopener noreferrer" aria-label="Mateřský web HolmTec" title="HolmTec" className="font-semibold transition-colors hover:text-white text-[hsl(var(--popover))] text-[7px] tracking-[0.26em]">HOLMTEC</a></div>;
}