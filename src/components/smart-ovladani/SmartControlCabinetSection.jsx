import React from 'react';

export default function SmartControlCabinetSection() {
  return (
    <section className="relative overflow-hidden border-y border-cyan-100 bg-[#f7fcfd] py-14 sm:py-18 lg:py-24" aria-labelledby="smart-cabinet-title">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(120deg,transparent_0_48%,rgba(60,160,180,.12)_48.2%,transparent_48.8%),linear-gradient(32deg,transparent_0_70%,rgba(122,225,239,.12)_70.2%,transparent_70.7%)] [background-size:620px_620px,760px_760px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-800">Rozvaděč MLŽIDLA.cz / chytré mlžení</p>
          <h2 id="smart-cabinet-title" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight tracking-[-.035em] text-[#082f3f] sm:text-4xl lg:text-5xl">Řízení, filtrace a měření v jednom přehledném bodě.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Nerezový box chrání chytrý ventil, filtr, snímač průtoku a napojení zón. Konkrétní výbava se volí podle počtu mlžítek, přívodu vody a požadovaného režimu.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {['chytrý ventil a Wi‑Fi řízení','filtrace a kontrola průtoku','skryté provedení pro veřejný prostor','přístup pro servis a zimní údržbu'].map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-100 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">{item}</div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">Ilustrační grafika · výbava a rozmístění se potvrzují podle konkrétního projektu.</p>
        </div>
        <div className="relative">
          <picture>
            <source media="(max-width: 640px)" srcSet="/media/smart/mlzidla-smart-cabinet-fade-mobile.gif" />
            <img src="/media/smart/mlzidla-smart-cabinet-fade.gif" alt="Animovaný přehled chytrého řízení mlžení MLŽIDLA.cz, rozvaděče, aplikace a měření spotřeby" className="h-auto w-full rounded-[2rem] border border-white/80 object-cover shadow-[0_24px_80px_rgba(8,47,63,.16)]" loading="lazy" />
          </picture>
          <img src="/media/smart/mlzidla-control-cabinet-transparent.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 hidden w-44 drop-shadow-2xl lg:block" />
        </div>
      </div>
    </section>
  );
}
