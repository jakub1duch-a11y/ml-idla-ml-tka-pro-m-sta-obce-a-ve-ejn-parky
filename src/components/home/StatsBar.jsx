import React from 'react';
import { Thermometer, ShieldCheck, Clock, Cpu } from 'lucide-react';

const STATS = [
  { icon: Thermometer, value: '2–8 °C', label: 'lokální ochlazení', note: 'vědecky doloženo' },
  { icon: ShieldCheck, value: 'AISI 316L', label: 'nerezová ocel', note: 'česká výroba HolmTec' },
  { icon: Clock, value: '48 h', label: 'vizualizace', note: 'do 48 hodin od poptávky' },
  { icon: Cpu, value: 'Smart', label: 'řízení', note: 'podle teploty a času' },
];

export default function StatsBar() {
  return (
    <section className="border-b border-border bg-[#0a1628] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-heading font-semibold leading-tight sm:text-xl">{s.value}</p>
                  <p className="text-[11px] text-white/50 leading-tight">{s.label}</p>
                  <p className="text-[10px] text-white/30 leading-tight hidden sm:block">{s.note}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="px-4 pb-3 text-[10px] text-white/25 sm:px-6 sm:text-center">
          * Účinek mlžení závisí na teplotě, vlhkosti a stínění konkrétního prostoru.
        </p>
      </div>
    </section>
  );
}