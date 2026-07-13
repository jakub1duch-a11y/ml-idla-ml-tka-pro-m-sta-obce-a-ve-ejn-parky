import React from 'react';

export default function MlzidlaProduktQuickSpecs({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {product.quickSpecs.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-2.5">
            <span className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
              <Icon size={14} className="text-slate-500" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</span>
              <span className="block text-xs font-bold text-slate-900">{s.value}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}