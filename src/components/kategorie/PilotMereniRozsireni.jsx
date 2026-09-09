import React from 'react';

const PHASES = [
  { num: '01', title: 'Pilot', desc: 'Instalace jednoho nebo dvou prvků na zkoušku v nejkritičtějším místě. Ověříme provoz, údržbu a reakci občanů.' },
  { num: '02', title: 'Měření', desc: 'Sběr dat o ochlazení, spotřebě vody a provozní spolehlivosti. Hodnocení s technologickými službami města.' },
  { num: '03', title: 'Rozšíření', desc: 'Návrh rozmístění pro celou lokalitu na základě ověřených dat. Smart řízení, servis a dlouhodobá podpora.' },
];

export default function PilotMereniRozsireni() {
  return (
    <section className="bg-[#0D2F4F] py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#7FC4E8]">Postup nasazení</p>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight lg:text-4xl">
          Pilot, měření, rozšíření — bez rizika velké investice.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PHASES.map((p, i) => (
            <div key={p.num} className="relative border border-white/12 bg-white/[.03] p-7">
              <span className="font-mono text-sm text-[#7FC4E8]">{p.num}</span>
              <h3 className="mt-3 font-heading text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.desc}</p>
              {i < PHASES.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#7FC4E8]/40 lg:block">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}