import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star } from 'lucide-react';

export const PARTNER_TIERS = [
  {
    key: 'projekt',
    name: 'Projektový partner',
    margin: '10 %',
    entry: 'Bez odběrového minima',
    for: 'Architekti, projektanti a zahradní studia',
    perks: ['2D/3D podklady a technické listy', 'Fotovizualizace do studie', 'Konzultace k umístění a přívodu vody', 'Cenová nabídka do 48 hodin'],
  },
  {
    key: 'realizacni',
    name: 'Realizační partner',
    margin: '15–20 %',
    entry: 'Od 3 instalací ročně',
    for: 'Zahradní a stavební realizační firmy',
    perks: ['Partnerská cenová hladina', 'Zaškolení montáže a servisu', 'Přednostní výrobní termíny', 'Podpora při jednání s investorem'],
    featured: true,
  },
  {
    key: 'exclusive',
    name: 'Regionální partner',
    margin: 'individuální',
    entry: 'Rámcová smlouva',
    for: 'Exkluzivní zastoupení pro region nebo zemi',
    perks: ['Vyhrazený region a přesměrování poptávek', 'Vzorkové mlžítko za nákladovou cenu', 'Společný marketing a reference', 'Vlastní kontaktní osoba v HolmTec'],
  },
];

export default function SpoluPartnerPricing() {
  return (
    <section id="partnerske-ceny" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl" data-reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-700">Partnerské ceny</p>
          <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900 lg:text-4xl">Tři úrovně spolupráce</h2>
          <p className="mt-4 font-light leading-relaxed text-slate-500">
            Partnerská hladina se odvíjí od role v projektu a objemu realizací. Konkrétní čísla potvrdíme v nabídce podle typu prvku a rozsahu instalace.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PARTNER_TIERS.map((t) => (
            <div key={t.key} data-reveal
              className={`relative flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${t.featured ? 'border-cyan-300 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-white'}`}>
              {t.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-cyan-400 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-950">
                  <Star size={10} /> Nejčastější
                </span>
              )}
              <p className={`font-mono text-[10px] uppercase tracking-widest ${t.featured ? 'text-cyan-300' : 'text-slate-400'}`}>{t.for}</p>
              <h3 className={`mt-2 font-heading text-2xl font-light ${t.featured ? 'text-white' : 'text-slate-900'}`}>{t.name}</h3>
              <p className={`mt-4 font-heading text-4xl font-light ${t.featured ? 'text-cyan-300' : 'text-slate-900'}`}>{t.margin}</p>
              <p className={`mt-1 text-xs font-light ${t.featured ? 'text-white/50' : 'text-slate-400'}`}>partnerská sleva z katalogové ceny · {t.entry}</p>
              <ul className="mt-6 space-y-2.5">
                {t.perks.map((p) => (
                  <li key={p} className={`flex items-start gap-2.5 text-sm font-light ${t.featured ? 'text-white/75' : 'text-slate-600'}`}>
                    <Check size={14} className={`mt-0.5 shrink-0 ${t.featured ? 'text-cyan-300' : 'text-cyan-600'}`} />{p}
                  </li>
                ))}
              </ul>
              <a href="#partnerska-poptavka"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${t.featured ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                Získat podmínky <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-6 text-xs font-light text-slate-400">
          Uvedené hladiny jsou orientační rámec spolupráce, nikoli konečná cena. Přesnou kalkulaci vždy potvrzuje individuální nabídka —{' '}
          <Link to="/kalkulacka" className="text-cyan-700 hover:underline">orientační kalkulačka</Link>.
        </p>
      </div>
    </section>
  );
}