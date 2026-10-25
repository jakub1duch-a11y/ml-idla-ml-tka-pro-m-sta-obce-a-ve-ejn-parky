import React from 'react';
import { Clock3, PenTool, ShieldCheck } from 'lucide-react';

const items = [
  [Clock3, 'Rychlá orientace v ceně'],
  [PenTool, 'Doporučení vhodného řešení'],
  [ShieldCheck, 'Přímý kontakt s technickým týmem'],
];

export default function InquiryTrust() {
  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      {items.map(([Icon, label]) => (
        <div key={label} className="flex items-center gap-3 p-4 border border-slate-200 bg-white">
          <Icon size={18} className="text-teal-700" />
          <span className="text-sm text-slate-700 font-body font-semibold">{label}</span>
        </div>
      ))}
    </div>
  );
}