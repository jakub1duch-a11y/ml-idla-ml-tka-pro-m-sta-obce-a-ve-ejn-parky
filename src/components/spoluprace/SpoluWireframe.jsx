import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutTemplate } from 'lucide-react';

const BLOCKS = [
  { n: '01', title: 'Hero — proč spolupracovat', role: 'Jedna věta hodnoty, dvě CTA (Nezávazná poptávka / Partnerské ceny), vizuál realizace.', kpi: 'CTA nad ohybem' },
  { n: '02', title: 'Pro koho', role: 'Architekti · Města a obce · Realizační firmy · Zahradní studia — každý s vlastním přínosem.', kpi: 'Rychlá sebeidentifikace' },
  { n: '03', title: 'Vizualizace na ukázku', role: 'Reálné prostředí + technický wireframe. Ukazuje, co partner dostane do studie.', kpi: 'Důkaz kvality' },
  { n: '04', title: 'Partnerské ceny', role: 'Tři úrovně marže, podmínky a co je v ceně. Bez skrytých položek.', kpi: 'Hlavní konverze' },
  { n: '05', title: 'Návrh nabídky', role: 'Ukázka struktury nabídky, kterou partner dostane do 48 hodin.', kpi: 'Snížení nejistoty' },
  { n: '06', title: 'Podklady a odkazy', role: 'Technická dokumentace, katalog, reference, kalkulačka — vnitřní prolinkování.', kpi: 'Hloubka návštěvy' },
  { n: '07', title: 'Kontakt / registrace partnera', role: 'Krátký formulář: jméno, e-mail, typ partnera, projekt.', kpi: 'Odeslaná poptávka' },
];

export default function SpoluWireframe() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl" data-reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-700">Wireframe a struktura</p>
          <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900 lg:text-4xl">Jak je stránka postavená</h2>
          <p className="mt-4 font-light leading-relaxed text-slate-500">
            Sedm bloků v pořadí, v jakém partner rozhoduje: hodnota → pro koho → důkaz → cena → nabídka → podklady → kontakt.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {BLOCKS.map((b) => (
            <div key={b.n} data-reveal className="group grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md sm:grid-cols-[52px_1fr]">
              <div className="font-mono text-2xl text-slate-300 transition group-hover:text-cyan-600">{b.n}</div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg text-slate-900">{b.title}</h3>
                  <span className="rounded-full bg-cyan-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-700">{b.kpi}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{b.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
          <LayoutTemplate size={18} className="text-cyan-600" />
          <p className="text-sm font-light text-slate-500">Struktura vychází z rozhodovacího procesu partnerů — stejnou logiku doporučujeme i pro segmentové stránky.</p>
          <Link to="/kategorie/architekti" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
            Podklady pro architekty <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}