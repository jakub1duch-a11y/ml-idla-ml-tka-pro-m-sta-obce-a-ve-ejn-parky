import React from 'react';
import { Droplets, Filter, Gauge, Share2, SprayCan, ArrowRight } from 'lucide-react';

const STEPS = [
{ icon: Droplets, label: 'Voda' },
{ icon: Filter, label: 'Filtrace' },
{ icon: Gauge, label: 'Čerpadlo' },
{ icon: Share2, label: 'Distribuce' },
{ icon: SprayCan, label: 'Trysky' }];

export default function DarkProcessFlow() {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[56px]">
              <div className="w-11 h-11 rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center">
                <s.icon size={18} className="text-cyan" />
              </div>
              <p className="text-[11px] text-white/70 font-medium text-center">{s.label}</p>
            </div>
            {i < STEPS.length - 1 && <ArrowRight size={14} className="text-white/20 shrink-0 hidden sm:block" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}