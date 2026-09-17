import React from 'react';

export default function PdHowItWorks({ product }) {
  const steps = [
    {
      num: '01',
      title: 'Navrhnout',
      desc: 'Podle prostoru určíme počet prvků, jejich rozmístění, přívod vody a způsob kotvení.',
    },
    {
      num: '02',
      title: 'Připojit',
      desc: product.pressure
        ? `Systém se připraví podle provozních parametrů produktu; evidovaný tlak je ${product.pressure}.`
        : 'Přívod vody a provozní tlak se navrhnou podle konkrétní instalace a dostupné infrastruktury.',
    },
    {
      num: '03',
      title: 'Řídit provoz',
      desc: product.power_supply
        ? `Řízení se řeší podle produktu a projektu. Evidované napájení / řízení: ${product.power_supply}.`
        : 'Provoz může být manuální nebo automatizovaný podle času, teploty či provozní logiky, pokud to projekt vyžaduje.',
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#0B5EA8]">Jak projekt probíhá</p>
        <h2 className="mt-4 max-w-2xl font-heading text-3xl leading-tight tracking-[-.03em] text-[#0D2F4F] lg:text-4xl">
          Od prostoru k funkčnímu mlžení
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="border border-[#DCEAF0] bg-white p-7">
              <span className="font-mono text-xs uppercase tracking-[.2em] text-[#0B5EA8]">// {step.num}</span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-[#0D2F4F]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5A6B78]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
