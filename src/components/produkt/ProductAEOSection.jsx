import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

function buildAnswers(product) {
  const pressure = product?.pressure || '2–7 BAR dle konkrétní konfigurace';
  const water = product?.water_consumption || 'podle počtu trysek a provozního režimu';
  const height = product?.coverage_area || 'dle zvolené varianty';
  const control = product?.power_supply || 'volitelné chytré řízení, časování a senzory';
  const material = product?.material || 'nerezová ocel vhodná pro venkovní provoz';

  return [
    {
      q: `Kde se ${product?.name || 'mlžítko'} nejčastěji používá?`,
      a: 'Ve veřejném prostoru, parcích, na náměstích, sportovištích, u škol, v komerčních zónách a dalších místech, kde je potřeba lokální ochlazení a kvalitní městský mobiliář.'
    },
    {
      q: 'Potřebuje systém vysokotlaké čerpadlo?',
      a: `Ne vždy. Konkrétní sestava se navrhuje podle vstupního tlaku, počtu trysek a požadovaného efektu. U vybraných řešení lze pracovat s tlakem ${pressure} a přímým napojením na vodovodní řad.`
    },
    {
      q: 'Jaká je spotřeba vody?',
      a: `Orientačně ${water}. Přesnou hodnotu dopočítáme podle počtu trysek, denní doby provozu, tlaku a zvoleného Smart Cooling scénáře.`
    },
    {
      q: 'Lze mlžení automatizovat?',
      a: `Ano. ${control}. Systém lze spouštět podle času, teploty, vytíženosti nebo předem nastavených provozních podmínek.`
    },
    {
      q: 'Je produkt vhodný pro dlouhodobý venkovní provoz?',
      a: `Ano. Konstrukce využívá ${material}; výsledná specifikace, kotvení a zimní režim se vždy přizpůsobí konkrétní instalaci.`
    },
    {
      q: 'Jaká je výška a rozsah řešení?',
      a: `Výška nebo rozměrová specifikace je ${height}. U městských realizací lze navrhnout jeden prvek, dvojici, bránu, alej nebo celé mlžiště.`
    }
  ];
}

export default function ProductAEOSection({ product }) {
  const answers = buildAnswers(product);

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-400">Rychlé odpovědi</p>
            <h2 className="mt-4 max-w-xl font-heading text-3xl leading-[1.08] tracking-[-.02em] text-slate-950 sm:text-4xl lg:text-5xl">
              Co potřebujete vědět před návrhem projektu.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Stručné odpovědi pro investora, město i projektanta. Přesné parametry vždy dopočítáme podle místa instalace, dostupného tlaku vody a požadovaného provozu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/smart-ovladani" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Smart Cooling <ArrowRight size={15} />
              </Link>
              <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400">
                Navrhnout řešení
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {answers.map((item) => (
              <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-slate-400" size={18} />
                  <div>
                    <h3 className="font-heading text-xl leading-tight text-slate-950 lg:text-2xl">{item.q}</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">{item.a}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { buildAnswers };