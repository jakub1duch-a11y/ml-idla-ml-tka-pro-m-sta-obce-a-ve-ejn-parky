import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const FALLBACK_REFS = [
  'ZOO Praha',
  'Město Jičín',
  'Město Polná',
  'MŠ Šiškova Praha 8',
  'Domov Palata Praha 5',
];

export default function ReferencesStrip() {
  const [names, setNames] = useState(FALLBACK_REFS);

  useEffect(() => {
    base44.entities.Realizace.filter({ published: true, category: 'mestsky' }, '-year', 10)
      .then((items) => {
        if (items?.length) {
          const list = items
            .map((r) => r.client || r.name)
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i);
          if (list.length) setNames(list);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-[#EAF5FB] bg-[#fbfdfe] py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-cyan-200/20 blur-[72px]" />
        <div className="absolute -right-20 top-2 h-52 w-52 rounded-full bg-sky-100/35 blur-[80px]" />
        <div className="absolute left-[18%] top-[-20%] h-44 w-[70%] rounded-[50%] bg-white/65 blur-[56px]" />
        <div className="animate-mist-drift absolute left-[8%] top-[44%] h-20 w-[84%] rounded-[50%] bg-cyan-100/10 blur-[34px] [animation-duration:18s]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[.2em] text-[#0D2F4F]/50">
          Důvěřují nám veřejné instituce
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {names.map((name) => (
            <span
              key={name}
              className="font-heading text-sm font-semibold text-[#0D2F4F]/70 sm:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}