import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Droplets } from 'lucide-react';

const WATER_PRICE_PER_M3 = 90; // Kč
const PRESSURES = [
  { label: '2 bar', key: 'flow_2bar' },
  { label: '5 bar', key: 'flow_5bar' },
  { label: '10 bar', key: 'flow_10bar' },
  { label: '15 bar', key: 'flow_15bar' },
];

function parseNumber(str) {
  if (!str) return 0;
  const match = String(str).match(/[\d.,]+/);
  return match ? parseFloat(match[0].replace(',', '.')) : 0;
}

export default function NozzleCostCalculator({ product }) {
  const [pressureIdx, setPressureIdx] = useState(1);
  const [hours, setHours] = useState(6);
  const [nozzleCount, setNozzleCount] = useState(6);

  const m2Variant = useMemo(() => {
    const variants = product.nozzle_variants || [];
    return variants.find((v) => /m2/i.test(v.code)) || variants.find((v) => v.is_standard) || variants[0] || null;
  }, [product.nozzle_variants]);

  const flowPerMinute = m2Variant ? parseNumber(m2Variant[PRESSURES[pressureIdx].key]) : parseNumber(product.water_consumption) / 60;
  const dailyLiters = flowPerMinute * nozzleCount * 60 * hours;
  const dailyCost = (dailyLiters / 1000) * WATER_PRICE_PER_M3;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-2xl border border-slate-200 bg-slate-900 p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={16} className="text-cyan" />
        <p className="font-mono tracking-widest uppercase text-white/60 text-xs">Technická kalkulace provozních nákladů</p>
      </div>
      <p className="text-xs text-white/40 mb-6">
        Výpočet dle {m2Variant ? `standardní trysky ${m2Variant.code}` : 'orientační spotřeby vody'}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {m2Variant && (
          <div>
            <p className="text-xs text-white/50 mb-2">Tlak vody</p>
            <div className="flex flex-wrap gap-2">
              {PRESSURES.map((p, i) => (
                <button key={p.key} type="button" onClick={() => setPressureIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${pressureIdx === i ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-white/60 border-white/20 hover:border-white/40'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {m2Variant && (
          <div>
            <label className="block text-xs text-white/50 mb-2">Počet trysek: <span className="text-white font-medium">{nozzleCount}</span></label>
            <input type="range" min="1" max="20" value={nozzleCount} onChange={(e) => setNozzleCount(Number(e.target.value))} className="w-full accent-cyan-400" />
          </div>
        )}
        <div className={m2Variant ? '' : 'sm:col-span-3'}>
          <label className="block text-xs text-white/50 mb-2">Provoz (hod / den): <span className="text-white font-medium">{hours} h</span></label>
          <input type="range" min="1" max="16" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-cyan-400" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div>
          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Denní náklad na vodu</p>
          <p className="text-3xl text-white font-heading font-medium">{dailyCost.toFixed(1)} Kč</p>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-xs max-w-[10rem] text-right">
          <Droplets size={14} className="shrink-0" /> {dailyLiters.toFixed(0)} l vody denně
        </div>
      </div>
    </motion.div>
  );
}