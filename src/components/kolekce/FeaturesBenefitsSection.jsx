import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    number: '01',
    title: 'Nerezové provedení',
    text: 'Materiál, profil i povrchovou úpravu určují parametry konkrétního modelu. Technické údaje uvádíme v jeho detailu.',
  },
  {
    number: '02',
    title: 'Mlha podle podmínek místa',
    text: 'Odpařování ovlivňuje teplota, vlhkost, vítr a směr trysek. Suchý povrch nelze zaručit za každého počasí.',
  },
  {
    number: '03',
    title: 'Voda a řízení',
    text: 'Napojení, filtrace i případná automatizace SUPLA závisí na vybraném technickém řešení a požadavcích provozu.',
  },
  {
    number: '04',
    title: 'Návrh a výroba HolmTec',
    text: 'Pro standardní i zakázkové provedení pomůžeme vybrat model, prověřit umístění, kotvení a rozsah instalace.',
  },
];

export default function FeaturesBenefitsSection() {
  return (
    <section className="border-y border-[#D5E4E9] bg-white py-16 sm:py-20" aria-labelledby="catalog-features-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[.76fr_1.24fr] lg:gap-16 lg:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#22778C]">Technické souvislosti</p>
          <h2 id="catalog-features-title" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-[1.1] tracking-[-.03em] text-[#0B2D3F] sm:text-4xl">
            Vzhled je začátek. Důležité je i správné umístění.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#526C78]">
            Jednotlivá mlžítka se liší tvarem, rozměry a technickým vybavením. Vhodnost vždy posuzujeme podle modelu a konkrétního prostoru.
          </p>
          <Link to="/jak-to-funguje" className="mt-7 inline-flex min-h-11 items-center gap-2 border-b-2 border-[#22778C] pb-1 text-sm font-semibold text-[#12475B] hover:border-[#0B2D3F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22778C]">
            Jak mlžení funguje <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="border-t border-[#C9DDE3]">
          {FEATURES.map(({ number, title, text }) => (
            <article key={number} className="grid gap-3 border-b border-[#D9E6E9] py-6 sm:grid-cols-[48px_1fr]">
              <span className="font-mono text-xs font-semibold text-[#22778C]">{number}</span>
              <div>
                <h3 className="font-heading text-xl font-semibold text-[#0B2D3F]">{title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-[#526C78]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
