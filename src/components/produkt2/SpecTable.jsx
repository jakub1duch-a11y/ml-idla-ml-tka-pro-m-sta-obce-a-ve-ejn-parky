import React from 'react';

export default function SpecTable({ title, rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="border border-white/15 mb-8">
      <div className="px-4 py-2.5 border-b border-white/15">
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">{title}</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-b-0">
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">{r.label}</span>
          <span className="font-mono text-sm text-white text-right">{r.value}</span>
        </div>
      ))}
    </div>
  );
}