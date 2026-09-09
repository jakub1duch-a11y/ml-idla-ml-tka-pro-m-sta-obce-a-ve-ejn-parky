import React from 'react';

export default function PdHowItWorks({ product }) {
  const steps = [
    { num: '01', title: 'Připravit místo', desc: 'Ověříme podklad, přívod vody, způsob kotvení a vhodné rozmístění prvků.' },
    { num: '02', title: 'Nastavit provoz', desc: product.power_supply ? `Řízení a napájení: ${product.power_supply}.` : 'Zvolíme manuální nebo automatizovaný způsob spouštění podle projektu.' },
    { num: '03', title: 'Spustit mlžení', desc: product.pressure ? `Provozní parametry produktu vycházejí z hodnoty ${product.pressure}.` : 'Provozní parametry a osazení trysek nastavíme podle konkrétního produktu a instalace.' },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Jak funguje realizace</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight tracking-[-.03em] text-[#0D2F4F] lg:text-4xl">Od prostoru k funkčnímu mlžení.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="border border-[#EAF5FB] p-7">
              <span className="font-heading text-3xl font-bold text-[#D8EEF8]">{s.num}</span>
              <h3 className="mt-2 font-heading text-lg font-semibold text-[#0D2F4F]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0D2F4F]/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
