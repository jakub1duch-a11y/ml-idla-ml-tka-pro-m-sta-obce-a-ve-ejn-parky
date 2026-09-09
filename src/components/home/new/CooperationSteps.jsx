import React from 'react';

const STEPS = [
  { num: '01', title: 'Analýza místa a podkladů', desc: 'Zpracujeme fotografie, půdorys, připojení vody a typ povrchu. Navrhujeme umístění s ohledem na provoz i údržbu.' },
  { num: '02', title: 'Návrh a vizualizace do 48 h', desc: 'Připravíme návrh rozmístění a vizualizaci produktu přímo ve vašem prostoru, včetně variant A/B/C.' },
  { num: '03', title: 'Nabídka s variantami a technickým listem', desc: 'Doložíme technický list, cenu variant, kotvení a provozní parametry. Strukturováno pro schvalování v radě.' },
  { num: '04', title: 'Výroba, instalace, zaškolení, servis', desc: 'Vyrobeno v Trutnově, instalace na klíč, zaškolení obsluhy a dlouhodobý servis včetně zazimování.' },
];

export default function CooperationSteps() {
  return (
    <section className="bg-[#0D2F4F] py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#7FC4E8]">Jak spolupracujeme s městy</p>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight lg:text-4xl">
          Od první konzultace po provoz a servis — v jednom toku.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.num} className="border border-white/12 bg-white/[.03] p-6">
              <span className="font-mono text-sm text-[#7FC4E8]">{s.num}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-sm text-white/50">
            Nabídky strukturujeme pro schvalování v radě nebo zastupitelstvu.
          </p>
        </div>
      </div>
    </section>
  );
}