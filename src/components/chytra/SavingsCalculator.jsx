import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WATER_L_PER_HOUR = 19.2;
const WATER_PRICE_PER_M3 = 85; // Kč
const WATER_SAVINGS = 0.35;
const DAYS_PER_MONTH = 30;
const REFERENCE_HOURS = 6;

const costFor = (liters) => Math.round(liters / 1000 * WATER_PRICE_PER_M3);

export default function SavingsCalculator() {
  const [hours, setHours] = useState([6]);
  const h = hours[0];

  const data = useMemo(() => {
    const standardWater = h * WATER_L_PER_HOUR * DAYS_PER_MONTH;
    const smartWater = standardWater * (1 - WATER_SAVINGS);
    const standardCost = costFor(standardWater);
    const smartCost = costFor(smartWater);
    return {
      water: [
      { name: 'Běžný systém', hodnota: Math.round(standardWater) },
      { name: 'Smart systém', hodnota: Math.round(smartWater) }],
      waterSaved: Math.round(standardWater - smartWater),
      standardCost,
      smartCost,
      costSaved: standardCost - smartCost
    };
  }, [h]);

  const dailyWater = Math.round(h * WATER_L_PER_HOUR);
  const dailyCost = costFor(dailyWater);
  const dailySmartCost = costFor(dailyWater * (1 - WATER_SAVINGS));
  const dailySaved = dailyCost - dailySmartCost;

  const refWaterLiters = Math.round(REFERENCE_HOURS * WATER_L_PER_HOUR);
  const refCost = costFor(refWaterLiters);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Interaktivní kalkulačka úspor</p>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-slate-600">Kolik hodin denně mlžení běží?</label>
          <span className="text-sm font-bold text-slate-900">{h} h / den</span>
        </div>
        <Slider value={hours} onValueChange={setHours} min={1} max={12} step={1} />
        <p className="text-xs font-mono text-slate-500 mt-3">
          {h} h/d = {dailyWater} l / {dailyCost} Kč = úspora se smart řízením <span className="text-emerald-600 font-bold">-{dailySaved} Kč</span>
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
        <Droplets size={18} className="text-cyan shrink-0" />
        <p className="text-sm text-slate-600">
          Za <strong className="text-slate-900">{REFERENCE_HOURS} h</strong> mlžení spotřebujete přibližně <strong className="text-slate-900">{refWaterLiters} l</strong> vody, tj. cca <strong className="text-slate-900">{refCost} Kč</strong>.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Droplets size={16} className="text-cyan" />
          <p className="text-sm font-medium text-slate-900">Spotřeba vody / měsíc</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.water}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v} l`} />
            <Bar dataKey="hodnota" fill="#0f172a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-emerald-600 font-medium mt-2">
          Úspora {data.waterSaved.toLocaleString('cs-CZ')} l / měsíc &middot; {data.costSaved.toLocaleString('cs-CZ')} Kč / měsíc
          <span className="block text-xs text-slate-400 font-normal mt-0.5">
            ({data.standardCost.toLocaleString('cs-CZ')} Kč časovačem → {data.smartCost.toLocaleString('cs-CZ')} Kč se smart řízením)
          </span>
        </motion.p>
      </div>
    </div>);

}