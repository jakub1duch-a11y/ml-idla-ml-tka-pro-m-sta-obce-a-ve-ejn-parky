import React from 'react';
import { Link } from 'react-router-dom';
import { Component, ArrowRight, ChevronDown } from 'lucide-react';

const LINKS = [
  { label: 'Produkty', to: '/mlzidla-mlzitka', hasChevron: true },
  { label: 'Realizace', to: '/reference' },
  { label: 'O nás', to: '/o-nas' },
  { label: 'Servis', to: '/servis-udrzba' },
  { label: 'Kontakt', to: '/kontakt' },
];

export default function MlzidlaCzNav() {
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/mlzidla" className="flex items-center gap-2.5">
          <Component size={24} className="text-blue-600" strokeWidth={1.5} />
          <div className="leading-tight">
            <p className="font-heading font-black text-slate-900 text-lg tracking-tight">MLŽIDLA.CZ®</p>
            <p className="text-[10px] font-bold text-blue-600 tracking-widest -mt-1">MLŽNÉ SYSTÉMY</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              {l.label.toUpperCase()}
              {l.hasChevron && <ChevronDown size={14} />}
            </Link>
          ))}
        </div>

        <Link to="/poptavka" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap">
          Vyžadat cenu řešení <ArrowRight size={15} />
        </Link>
      </div>
    </nav>
  );
}