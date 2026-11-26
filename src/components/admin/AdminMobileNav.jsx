import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function AdminMobileNav({ tabs, groups, activeTab, onChange }) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/8 bg-[#0d1117] px-4 md:hidden">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">MLŽIDLA</p>
      <label className="relative flex-1">
        <select aria-label="Sekce administrace" value={activeTab} onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-8 text-sm text-white outline-none">
          {(groups || [{label: "Administrace", ids: tabs.map(t => t.id)}]).map(group => <optgroup key={group.label} label={group.label} className="bg-[#0d1117]">{group.ids.map(id => tabs.find(t => t.id === id)).filter(Boolean).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</optgroup>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40" />
      </label>
    </div>
  );
}