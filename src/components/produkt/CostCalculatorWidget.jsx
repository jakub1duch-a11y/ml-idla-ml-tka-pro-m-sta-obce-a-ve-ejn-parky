import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';

const WATER_PRICE_PER_M3 = 90; // Kč

export default function CostCalculatorWidget({ waterConsumption }) {
  const [hours, setHours] = useState(6);

  const litersPerHour = useMemo(() => {
    const match = (waterConsumption || '').match(/[\d.,]+/);
    return match ? parseFloat(match[0].replace(',', '.')) : 8;
  }, [waterConsumption]);

  const dailyLiters = litersPerHour * hours;
  const dailyTotal = dailyLiters / 1000 * WATER_PRICE_PER_M3;

  return (
    <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-sm bg-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={16} className="text-white/70" />
        <p className="font-mono tracking-widest uppercase text-white/60 text-xs">KALKULAČKA PROVOZNÍCH NÁKLADŮ</p>
      </div>
      <label className="block mb-2 text-xs text-white/60">Provoz (hod / den): <span className="text-white font-medium">{hours} h</span></label>
      <input
        type="range" min="1" max="16" value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        className="w-full mb-5 accent-cyan-400" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Denní náklad na vodu</p>
          <p className="text-2xl text-white [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">{dailyTotal.toFixed(1)} Kč</p>
        </div>
        <p className="text-[11px] max-w-[9rem] text-right leading-snug text-white/60">{dailyLiters.toFixed(0)} l vody, nízkotlaký provoz 2–7 BAR</p>
      </div>
    </div>);

}