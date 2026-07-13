import React from 'react';
import { Droplet, Thermometer, ShieldCheck, Gauge, Baby, Flag } from 'lucide-react';

const SPECS = [
  { icon: Droplet, label: 'Jemná vodní mlha' },
  { icon: Thermometer, label: 'Ochlazení okolí až o 10 °C' },
  { icon: ShieldCheck, label: 'Nerezová konstrukce AISI 304 / 316' },
  { icon: Gauge, label: 'Nízká spotřeba vody' },
  { icon: Baby, label: 'Bezpečné pro děti' },
  { icon: Flag, label: 'Česká výroba' },
];

export default function MlzidlaCzSpecsSidebar() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 h-full space-y-1">
      {SPECS.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-3 p-2.5 rounded-xl">
            <span className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
              <Icon size={15} className="text-blue-600" strokeWidth={1.75} />
            </span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide leading-tight">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}