import React from 'react';
import { Grid2X2 } from 'lucide-react';

export default function MlzidlaCzSidebar({ products, activeId, onSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 h-full">
      <p className="text-[11px] font-bold text-blue-600 tracking-widest uppercase mb-4 px-2">Naše produkty</p>
      <div className="space-y-1">
        {products.map((p) => {
          const Icon = p.icon;
          const active = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${active ? 'bg-blue-50 border border-blue-200' : 'border border-transparent hover:bg-slate-50'}`}
            >
              <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${active ? 'bg-blue-600' : 'bg-slate-100'}`}>
                <Icon size={16} className={active ? 'text-white' : 'text-slate-500'} strokeWidth={1.75} />
              </span>
              <span>
                <span className={`block text-sm font-bold ${active ? 'text-blue-700' : 'text-slate-900'}`}>{p.name}</span>
                <span className="block text-xs text-slate-400">{p.short}</span>
              </span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
            </button>
          );
        })}
      </div>
      <button className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors">
        <Grid2X2 size={14} /> Zobrazit všechny
      </button>
    </div>
  );
}