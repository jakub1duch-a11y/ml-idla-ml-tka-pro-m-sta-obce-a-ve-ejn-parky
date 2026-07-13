import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ListChecks, Wrench, Headset, ArrowRight } from 'lucide-react';

const ITEMS = [
  { icon: Users, label: 'Konzultace zdarma' },
  { icon: ListChecks, label: 'Návrh řešení na míru' },
  { icon: Wrench, label: 'Profesionální montáž' },
  { icon: Headset, label: 'Servis a podpora' },
];

export default function MlzidlaProduktCTA() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div>
        <h3 className="font-heading font-black text-xl text-slate-900 mb-1">Máte zájem o řešení na míru?</h3>
        <p className="text-sm text-slate-400">Rádi navrhneme ideální mlžný systém přesně podle vašich potřeb.</p>
      </div>
      <div className="flex flex-wrap gap-6">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="flex flex-col items-center gap-1.5 text-center w-20">
              <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon size={16} className="text-blue-600" strokeWidth={1.75} />
              </span>
              <span className="text-[10px] font-semibold text-slate-500 leading-tight">{it.label}</span>
            </div>
          );
        })}
      </div>
      <Link to="/poptavka" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-3 rounded-full transition-colors whitespace-nowrap">
        Poptat řešení <ArrowRight size={15} />
      </Link>
    </div>
  );
}