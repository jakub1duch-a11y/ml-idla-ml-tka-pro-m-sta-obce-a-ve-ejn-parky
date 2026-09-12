import React from 'react';
import { FAMILIES } from '@/lib/productFamilies';

export default function FamilyNav({ activeFamily, onSelect, counts = {} }) {
  return (
    <section className="border-y border-[#D3E2E8] bg-[#F4FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">Struktura nabídky</p>
        <h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold text-[#0A1628] sm:text-4xl">Čtyři kolekce. Jedna nerezová řemeslná dílna.</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILIES.map((f) => {
            const active = activeFamily === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelect(active ? null : f.id)}
                aria-pressed={active}
                className={`fam-tile text-left ${active ? 'fam-tile-active' : ''}`}
              >
                <span className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[.14em] text-[#22D3EE]">// {f.code}</span>
                  <span className="font-mono text-[11px] text-current opacity-60">{counts[f.id] ?? 0} produktů</span>
                </span>
                <span className="mt-5 block font-heading text-lg font-bold leading-tight">{f.label}</span>
                <span className="mt-1 block text-sm opacity-75">{f.title}</span>
                <span className="mt-4 block text-[13px] leading-relaxed opacity-70">{f.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}