import React from 'react';
import { Snowflake, Droplet, ShieldCheck, Leaf, Settings, Box } from 'lucide-react';

const FEATURES = [
  { icon: Snowflake, label: 'Dokonalé ochlazení', desc: 'Snížení teploty až o 10 °C' },
  { icon: Droplet, label: 'Jemná mlha', desc: 'Mikrokapky pro maximální komfort a efekt' },
  { icon: ShieldCheck, label: 'Bezpečné řešení', desc: 'Bez chemie, vhodné pro děti i zvířata' },
  { icon: Leaf, label: 'Úsporné a udržitelné', desc: 'Nízká spotřeba vody a energie' },
  { icon: Settings, label: 'Chytré ovládání', desc: 'Automatizace, časování, senzory' },
  { icon: Box, label: 'Řešení na míru', desc: 'Návrh, výroba a montáž' },
];

export default function MlzidlaCzFeatureRow() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.label} className="flex flex-col items-start gap-2">
            <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon size={16} className="text-blue-600" strokeWidth={1.75} />
            </span>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wide leading-tight">{f.label}</p>
            <p className="text-[11px] text-slate-400 leading-snug">{f.desc}</p>
          </div>
        );
      })}
    </div>
  );
}