import React from 'react';

export default function GateFeatureCard({ item, active, onClick, side }) {
  const Icon = item.icon;
  const linePosition = side === 'left' ? 'right-[-3rem]' : 'left-[-3rem]';
  return <button onClick={onClick} className={`group relative w-full border p-4 text-left transition-all duration-500 ${active ? 'border-cyan bg-cyan/10 shadow-[0_0_26px_rgba(34,211,238,.12)]' : 'border-white/10 bg-white/[.03] hover:border-white/25'}`}>
    <span className={`absolute top-1/2 hidden h-px w-12 -translate-y-1/2 lg:block ${linePosition} ${active ? 'bg-cyan shadow-[0_0_8px_#22d3ee]' : 'bg-white/15'}`} />
    <span className={`absolute top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full lg:block ${side === 'left' ? 'right-[-3.25rem]' : 'left-[-3.25rem]'} ${active ? 'bg-cyan shadow-[0_0_12px_#22d3ee]' : 'bg-white/20'}`} />
    <div className="flex gap-3"><Icon size={20} className={active ? 'animate-pulse text-cyan' : 'text-white/45'} /><div><h3 className="text-sm font-semibold text-white">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-white/50">{item.text}</p></div></div>
  </button>;
}