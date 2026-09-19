import React from 'react';

const STEPS = [
  { num: '01', title: 'Připojit', desc: 'Napojení na vodovodní řad 2–8 bar s předřazeným filtrem.' },
  { num: '02', title: 'Nastavit', desc: 'Časovač nebo mobilní aplikace — interval a doba mlžení.' },
  { num: '03', title: 'Osvěžit', desc: 'Jemná mlha 50–100 µm ochladí prostor bez zamokření.' },
];

export default function PdHowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Jak funguje</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">Jednoduše. Přehledně. Svěže.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num} className="border border-[#EAF5FB] p-7">
              <span className="font-heading text-3xl font-bold text-[#EAF5FB]">{s.num}</span>
              <h3 className="mt-2 font-heading text-lg font-semibold text-[#0D2F4F]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0D2F4F]/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}