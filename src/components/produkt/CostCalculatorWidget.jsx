import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

const WATER_PRICE_PER_M3 = 90; // Kč
const ENERGY_PRICE_PER_KWH = 6; // Kč
const LOW_PRESSURE_POWER_KW = 0.35; // malé čerpadlo, provoz 2–7 BAR

export default function CostCalculatorWidget({ waterConsumption }) {
  const [hours, setHours] = useState(6);

  const litersPerHour = useMemo(() => {
    const match = (waterConsumption || '').match(/[\d.,]+/);
    return match ? parseFloat(match[0].replace(',', '.')) : 8;
  }, [waterConsumption]);

  const dailyWaterCost = litersPerHour * hours / 1000 * WATER_PRICE_PER_M3;
  const dailyEnergyCost = LOW_PRESSURE_POWER_KW * hours * ENERGY_PRICE_PER_KWH;
  const dailyTotal = dailyWaterCost + dailyEnergyCost;

  return (
    <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-sm bg-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={16} className="text-white/70" />
        <p className="text-[10px] font-mono tracking-widest uppercase text-white/60">Kalkulačka provozních nákladů</p>
      </div>
      <label className="block text-xs text-white/50 mb-2">Provoz (hod / den): <span className="text-white font-medium">{hours} h</span></label>
      <input
        type="range" min="1" max="16" value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        className="w-full accent-cyan-400 mb-5" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Denní náklad</p>
          <p className="text-2xl text-white [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">{dailyTotal.toFixed(1)} Kč</p>
        </div>
        <p className="text-[11px] text-white/40 max-w-[9rem] text-right leading-snug">Nízkotlaký provoz 2–7 BAR, bez čerpadel</p>
      </div>
    </div>);

}