import React from 'react';
import QuickBenefits from '@/components/home/QuickBenefits';

export default function MistBenefitsSection() {
  return <section id="vyhody" className="bg-slate-950 px-5 py-12 lg:hidden"><div className="mx-auto max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Rychlé výhody</p><h2 className="mt-3 font-heading text-4xl font-medium tracking-tight text-white">Příjemný prostor i v horkém dni.</h2><QuickBenefits compact className="mt-8 grid-cols-1 sm:grid-cols-2" /></div></section>;
}