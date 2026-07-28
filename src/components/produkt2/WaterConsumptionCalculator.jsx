import React, { useState } from 'react';
import { Droplets, Minus, Plus } from 'lucide-react';

const FLOW_PER_NOZZLE_LH = 12; // l/h per nozzle at reference 4 bar

export default function WaterConsumptionCalculator({ defaultNozzles = 6 }) {
  const [nozzles, setNozzles] = useState(defaultNozzles);
  const totalLH = nozzles * FLOW_PER_NOZZLE_LH;

  return (
    <div className="border border-white/15">
      <div className="px-4 py-2.5 border-b border-white/15 flex items-center gap-2">
        <Droplets size={13} className="text-techblue" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">Kalkulačka spotřeby vody @ 4 bar</span>
      </div>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Počet trysek</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setNozzles((n) => Math.max(1, n - 1))} className="w-7 h-7 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"><Minus size={12} /></button>
          <span className="font-mono text-sm text-white w-6 text-center">{nozzles}</span>
          <button onClick={() => setNozzles((n) => Math.min(16, n + 1))} className="w-7 h-7 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"><Plus size={12} /></button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Tlak mlžení</span>
        <span className="font-mono text-sm text-white">4 bar (referenční)</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Spotřeba za hodinu</span>
        <span className="font-mono text-sm text-techblue font-bold">{totalLH} l/h</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Odhad za 8h provozu</span>
        <span className="font-mono text-sm text-white">{totalLH * 8} l</span>
      </div>
      <p className="px-4 py-3 text-[11px] text-white/30 font-mono leading-relaxed border-t border-white/10">
        * Orientační výpočet: {FLOW_PER_NOZZLE_LH} l/h na trysku při referenčním tlaku 4 bar. Skutečná spotřeba se liší dle typu trysky a provozního tlaku.
      </p>
    </div>
  );
}