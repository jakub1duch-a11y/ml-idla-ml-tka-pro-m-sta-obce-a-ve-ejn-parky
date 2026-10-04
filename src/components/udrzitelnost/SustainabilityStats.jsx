import React from 'react';
import { Droplets, Gauge, Recycle, Wrench } from 'lucide-react';

const STATS = [
  { icon: Droplets, value: 'Řízená spotřeba', label: 'průtok podle konkrétního produktu a provozního režimu' },
  { icon: Gauge, value: '2–8 bar', label: 'u vybraných systémů provoz přímo z vodovodního řadu' },
  { icon: Recycle, value: 'Nerez', label: 'odolný materiál s dlouhou životností a vysokou mírou recyklovatelnosti' },
  { icon: Wrench, value: 'Servis', label: 'udržovatelný systém s možností pravidelné kontroly a zazimování' },
];

export default function SustainabilityStats() {
  return (
    <section className="border-b border-border bg-slate-950 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {STATS.map(({icon:Icon,value,label}) => <article key={value} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
          <Icon size={18} className="text-cyan-300"/>
          <h2 className="mt-4 font-heading text-2xl text-white">{value}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{label}</p>
        </article>)}
      </div>
    </section>
  );
}