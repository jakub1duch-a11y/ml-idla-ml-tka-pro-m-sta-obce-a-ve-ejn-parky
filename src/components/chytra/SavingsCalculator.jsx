import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WATER_L_PER_HOUR = 19.2;
const ENERGY_KWH_PER_HOUR = 0.55;
const WATER_SAVINGS = 0.35;
const ENERGY_SAVINGS = 0.4;
const DAYS_PER_MONTH = 30;

export default function SavingsCalculator() {
  const [hours, setHours] = useState([6]);
  const h = hours[0];

  const data = useMemo(() => {
    const standardWater = h * WATER_L_PER_HOUR * DAYS_PER_MONTH;
    const smartWater = standardWater * (1 - WATER_SAVINGS);
    const standardEnergy = h * ENERGY_KWH_PER_HOUR * DAYS_PER_MONTH;
    const smartEnergy = standardEnergy * (1 - ENERGY_SAVINGS);
    return {
      water: [
      { name: 'Běžný systém', hodnota: Math.round(standardWater) },
      { name: 'Smart systém', hodnota: Math.round(smartWater) }],

      energy: [
      { name: 'Běžný systém', hodnota: Math.round(standardEnergy * 10) / 10 },
      { name: 'Smart systém', hodnota: Math.round(smartEnergy * 10) / 10 }],

      waterSaved: Math.round(standardWater - smartWater),
      energySaved: Math.round((standardEnergy - smartEnergy) * 10) / 10
    };
  }, [h]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Interaktivní kalkulačka úspor</p>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-slate-600">Kolik hodin denně mlžení běží?</label>
          <span className="text-sm font-bold text-slate-900">{h} h / den</span>
        </div>
        <Slider value={hours} onValueChange={setHours} min={1} max={12} step={1} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Droplets size={16} className="text-cyan" />
            <p className="text-sm font-medium text-slate-900">Spotřeba vody / měsíc</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.water}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v} l`} />
              <Bar dataKey="hodnota" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-emerald-600 font-medium mt-2">
            Úspora {data.waterSaved.toLocaleString('cs-CZ')} l / měsíc
          </motion.p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-cyan" />
            <p className="text-sm font-medium text-slate-900">Spotřeba energie / měsíc</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.energy}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v} kWh`} />
              <Bar dataKey="hodnota" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-emerald-600 font-medium mt-2">
            Úspora {data.energySaved.toLocaleString('cs-CZ')} kWh / měsíc
          </motion.p>
        </div>
      </div>
    </div>);

}