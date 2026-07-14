import React from 'react';
import { Snowflake, Wind, Eye, Sparkles } from 'lucide-react';

const BENEFITS = [
{ icon: Snowflake, title: 'Efektivní chlazení', desc: 'Snížení teploty vzduchu bez elektrické spotřeby.' },
{ icon: Wind, title: 'Čistší vzduch', desc: 'Mikrokapky vážou prach a zlepšují mikroklima.' },
{ icon: Eye, title: 'Vizualizace vody', desc: 'Sledování spotřeby a stavu systému online.' },
{ icon: Sparkles, title: 'Estetický prvek', desc: 'Designový doplněk veřejného prostoru.' }];

export default function DarkBenefitsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BENEFITS.map((b) => (
        <div key={b.title} className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
          <b.icon size={16} className="text-cyan mb-2" />
          <p className="text-xs sm:text-sm text-white font-semibold leading-tight mb-1">{b.title}</p>
          <p className="text-[11px] text-white/50 leading-snug">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}