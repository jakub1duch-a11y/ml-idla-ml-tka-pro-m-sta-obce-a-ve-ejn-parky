import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomeCta() {
  return <section className="bg-slate-950 px-6 py-20 text-white lg:px-14"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">CITY Arc konfigurátor</p><h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight">Sestavte řešení pro váš prostor.</h2></div><Link to="/city-arc" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950">Otevřít konfigurátor <ArrowRight size={16} /></Link></div></section>;
}