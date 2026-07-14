import React from 'react';
import { Layers, Droplets } from 'lucide-react';

export default function ProjectTechTable({ technologies, mistPointsCount }) {
  if ((!technologies || technologies.length === 0) && !mistPointsCount) return null;

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400">Technický přehled instalace</p>
      </div>
      <div className="divide-y divide-slate-100">
        {technologies && technologies.length > 0 && (
          <div className="flex items-start gap-3 px-6 py-4">
            <Layers size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1.5">Použité technologie</p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {mistPointsCount > 0 && (
          <div className="flex items-center gap-3 px-6 py-4">
            <Droplets size={16} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1">Počet mlžicích bodů</p>
              <p className="text-sm text-slate-900 font-medium">{mistPointsCount} ks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}