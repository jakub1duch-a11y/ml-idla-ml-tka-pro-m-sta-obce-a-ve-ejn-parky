import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return <div className="inline-flex h-full items-center gap-2 whitespace-nowrap leading-none text-slate-950"><Link to="/" aria-label="Mlžidla.cz" className={`${compact ? 'text-2xl sm:text-3xl xl:text-[2rem]' : 'text-3xl sm:text-4xl'} font-heading font-semibold tracking-tight text-[hsl(var(--background))]`}><span className="text-cyan">mlž</span>idla</Link></div>;
}