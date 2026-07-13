import React from 'react';

export const TABS2 = [
  { id: 'o-produktu', label: 'O produktu' },
  { id: 'technicke', label: 'Technické' },
  { id: 'benefity', label: 'Benefity' },
  { id: 'instalace', label: 'Instalace' },
  { id: 'video', label: 'Video' },
];

export default function ProductTabsNav({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 px-8 lg:px-14 pt-6 border-b border-white/10">
      {TABS2.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 border transition-all ${active === t.id ? 'border-techblue text-techblue bg-techblue/10' : 'border-white/10 text-white/40 hover:text-white/70'}`}>
          [{t.label}]
        </button>
      ))}
    </div>
  );
}