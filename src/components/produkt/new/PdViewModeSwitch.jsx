import React from 'react';
import { LayoutGrid, Rows3, Sparkles } from 'lucide-react';

const MODES = [
{
  id: 'classic',
  label: 'Klasické',
  description: 'Kompletní detail',
  icon: Rows3
},
{
  id: 'standard',
  label: 'Standardní',
  description: 'Vyvážený přehled',
  icon: LayoutGrid
},
{
  id: 'new',
  label: 'Nové',
  description: 'Krátké a vizuální',
  icon: Sparkles
}];


export default function PdViewModeSwitch({ mode, onChange }) {
  return (
    <div className="z-[60] border-b border-[#D8E8ED] bg-white/92 backdrop-blur-2xl sticky top-2">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
        <span className="hidden shrink-0 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#0D2F4F]/42 sm:block">
          Zobrazení detailu
        </span>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-1 rounded-[18px] border border-[#D8E8ED] bg-[#F4FAFC] p-1 sm:ml-auto sm:max-w-[520px]">
          {MODES.map(({ id, label, description, icon: Icon }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(id)}
                className={`min-h-11 rounded-[14px] px-2 py-2 text-left transition sm:px-3 ${active ? 'bg-[#07131D] text-white shadow-sm' : 'text-[#5A6B78] hover:bg-white hover:text-[#07131D]'}`}>
                
                <span className="flex items-center justify-center gap-1.5 sm:justify-start">
                  <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
                  <strong className="text-[11px] sm:text-xs">{label}</strong>
                </span>
                <span className={`mt-0.5 hidden text-[9px] leading-4 sm:block ${active ? 'text-white/58' : 'text-[#5A6B78]/64'}`}>
                  {description}
                </span>
              </button>);

          })}
        </div>
      </div>
    </div>);

}