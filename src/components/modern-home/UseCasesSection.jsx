import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const useCases = ['Města a obce', 'Firemní areály', 'Parky a hřiště', 'Eventy a festivaly'];

export default function UseCasesSection() {
  return <section id="realizace" className="border-b border-[#e5e5e5] px-6 py-24 lg:px-14"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Navrženo pro každý prostor</p><h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Řešení, které zapadne do místa.</h2></div><Link to="/reference" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">Všechny realizace <ArrowRight size={16} /></Link></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{useCases.map((title, index) => <article key={title} className="aspect-[4/3] rounded-lg border border-[#e5e5e5] bg-slate-50 p-5"><p className="text-xs text-slate-400">0{index + 1}</p><h3 className="mt-16 text-xl font-semibold tracking-tight text-slate-950">{title}</h3></article>)}</div></div></section>;
}