import React, { useState } from 'react';
import { Droplets, Minus, Plus } from 'lucide-react';

const FLOW_PER_NOZZLE_LH = 12; // l/h na trysku při referenčním tlaku 4 bar
const WATER_PRICE_PER_M3 = 85; // Kč / m³ (ČR průměr 2025)
const NOZZLE_PRICE_KC = 390; // Kč za 1 ks nerezové trysky AISI 316L
const SEASON_HOURS = 300; // orientační provoz za letní sezónu

const costFor = (liters) => (liters / 1000 * WATER_PRICE_PER_M3).toFixed(liters < 100 ? 2 : 0);

export default function WaterConsumptionCalculator({ defaultNozzles = 6 }) {
  const [nozzles, setNozzles] = useState(defaultNozzles);

  const nozzleLH = FLOW_PER_NOZZLE_LH;
  const totalLH = nozzles * FLOW_PER_NOZZLE_LH;
  const total8h = totalLH * 8;
  const seasonWater = totalLH * SEASON_HOURS;

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
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Spotřeba 1 trysky</span>
        <span className="font-mono text-sm text-white">{nozzleLH} l/h = {costFor(nozzleLH)} Kč/h</span>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Spotřeba mlžítka ({nozzles} trysek)</span>
        <span className="font-mono text-sm text-techblue font-bold">{totalLH} l/h = {costFor(totalLH)} Kč/h</span>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Za 8 h mlžení</span>
        <span className="font-mono text-sm text-white">{total8h} l = {costFor(total8h)} Kč</span>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Za letní sezónu ({SEASON_HOURS} h)</span>
        <span className="font-mono text-sm text-techblue font-bold">{costFor(seasonWater)} Kč</span>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-white/50">Cena 1 trysky (AISI 316L)</span>
        <span className="font-mono text-sm text-white">{NOZZLE_PRICE_KC} Kč</span>
      </div>

      <p className="px-4 py-3 text-[11px] text-white/30 font-mono leading-relaxed border-t border-white/10">
        * Orientační výpočet: {FLOW_PER_NOZZLE_LH} l/h na trysku při referenčním tlaku 4 bar, voda {WATER_PRICE_PER_M3} Kč/m³. Skutečná spotřeba se liší dle typu trysky a provozního tlaku.
      </p>
    </div>
  );
}