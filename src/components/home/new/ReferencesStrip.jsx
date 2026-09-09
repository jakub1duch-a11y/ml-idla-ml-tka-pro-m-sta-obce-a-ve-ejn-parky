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
    <section className="border-b border-[#EAF5FB] bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
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