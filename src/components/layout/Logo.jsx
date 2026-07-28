import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', theme = 'dark' }) {
  const compact = size === 'sm';
  const light = theme === 'light';
  return <div className={`inline-flex h-full items-center gap-2 whitespace-nowrap leading-none ${light ? 'text-slate-950' : 'text-white'}`}><Link to="/" aria-label="Mlžidla.cz" className={`${compact ? 'text-2xl sm:text-3xl xl:text-[2rem]' : 'text-3xl sm:text-4xl'} font-heading font-semibold tracking-tight`}><span className="text-sky-500">mlž</span>idla</Link><a href="https://holmtec.cz" target="_blank" rel="noopener noreferrer" aria-label="Mateřský web HolmTec" title="HolmTec" className={`font-semibold transition-colors text-[7px] tracking-[0.26em] ${light ? 'text-slate-500 hover:text-slate-950' : 'text-[hsl(var(--popover))] hover:text-white'}`}>HOLMTEC</a></div>;
}