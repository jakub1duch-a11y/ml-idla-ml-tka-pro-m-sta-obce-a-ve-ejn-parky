import React from 'react';

export default function SpecTable({ title, rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden mb-8">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 last:border-b-0">
          <span className="text-sm text-slate-500">{r.label}</span>
          <span className="text-sm font-medium text-slate-900 text-right">{r.value}</span>
        </div>
      ))}
    </div>
  );
}