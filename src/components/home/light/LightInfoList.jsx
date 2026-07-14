import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const LINKS = [
{ label: 'Katalogy ke stažení', to: '/ke-stazeni' },
{ label: 'Časté dotazy', to: '/podpora' },
{ label: 'Servis a údržba', to: '/servis-udrzba' },
{ label: 'Obchodní podmínky', to: '/obchodni-podminky' }];

export default function LightInfoList() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <h2 className="font-heading font-bold text-2xl text-slate-900 mb-6">Informace a podpora</h2>
      <div className="divide-y divide-slate-200 border-y border-slate-200">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="flex items-center justify-between py-4 group">
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{l.label}</span>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}