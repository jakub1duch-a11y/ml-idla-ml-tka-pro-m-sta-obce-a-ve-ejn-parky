import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import useGsapReveal from '@/hooks/useGsapReveal';
import SpoluHero from '@/components/spoluprace/SpoluHero';
import SpoluAudience from '@/components/spoluprace/SpoluAudience';
import SpoluVisualizations from '@/components/spoluprace/SpoluVisualizations';
import SpoluWireframe from '@/components/spoluprace/SpoluWireframe';
import SpoluPartnerPricing, { PARTNER_TIERS } from '@/components/spoluprace/SpoluPartnerPricing';
import SpoluOfferDraft from '@/components/spoluprace/SpoluOfferDraft';
import SpoluResources from '@/components/spoluprace/SpoluResources';
import SpoluPartnerForm from '@/components/spoluprace/SpoluPartnerForm';

const BASE_URL = 'https://mlzidla.cz';
const PATH = '/spoluprace';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6158a8485_generated_image.png';

const VISUALS = [
  {
    url: HERO_IMAGE,
    tag: 'Městské náměstí · fotovizualizace',
    alt: 'Vizualizace nerezové mlžné brány MLŽIDLA® na městském náměstí',
    desc: 'Mlžná brána v reálném měřítku náměstí — ukazuje průchodnost, výšku mlžného pásu i vliv na pobytovou kvalitu prostoru.',
  },
  {
    url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8f6a1245f_generated_image.png',
    tag: 'Technický podklad · schéma',
    alt: 'Technické schéma mlžné brány s rozměry, tryskami a přívodem vody',
    desc: 'Technický podklad s rozměry, počtem trysek a napojením na vodu — vstup do projektové dokumentace a koordinace profesí.',
  },
  {
    url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/62f148d8b_generated_image.png',
    tag: 'Zahrada a terasa · fotovizualizace',
    alt: 'Vizualizace zahradního mlžítka u pergoly na terase',
    desc: 'Zahradní mlžítko u pergoly — nízkotlaké řešení na vodovodní řad, bez čerpadla, s jemnou mlhou pro pobytovou zónu.',
  },
];

const FAQ = [
  { q: 'Jak funguje partnerská spolupráce s MLŽIDLA®?', a: 'Partner získá technické podklady, vizualizace do konkrétního prostoru a partnerskou cenovou hladinu podle své role v projektu. Konkrétní podmínky potvrzujeme individuální nabídkou.' },
  { q: 'Jaké jsou partnerské ceny a slevy?', a: 'Projektový partner má hladinu 10 %, realizační partner 15–20 % z katalogové ceny a regionální partner individuální podmínky podle rámcové smlouvy. Uvedené hladiny jsou orientační rámec, nikoli konečná cena.' },
  { q: 'Co obsahuje návrh nabídky?', a: 'Zadání a doporučené řešení, technickou specifikaci (nerez AISI 316L, provozní tlak 3–5 bar, kotvení), cenovou rekapitulaci po položkách, termíny výroby a instalace a podmínky záruky a servisu.' },
  { q: 'Jak dlouho trvá připravit nabídku a vizualizaci?', a: 'Návrh nabídky posíláme do 48 hodin od doplnění zadání. Výroba na míru trvá zpravidla do 8 týdnů od schválení výkresové dokumentace.' },
  { q: 'Pro koho je partnerský program určen?', a: 'Pro architekty a projektanty, města a obce, realizační a zahradní firmy. Každé skupině připravujeme jiný rozsah podkladů podle role v projektu.' },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${BASE_URL}${PATH}#service`,
      name: 'Partnerská spolupráce MLŽIDLA® — mlžítka a mlžné brány',
      serviceType: 'Partnerský program pro architekty, města, realizační firmy a zahradní studia',
      description: 'Partnerský program pro návrh a dodávku nerezových mlžítek, mlhovišť a mlžných bran: technické podklady, vizualizace, partnerské ceny, výroba na míru, instalace a servis.',
      provider: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: 'https://holmtec.cz' },
      areaServed: { '@type': 'Country', name: 'Česká republika' },
      audience: { '@type': 'Audience', audienceType: 'Architekti, projektanti, města a obce, realizační firmy, zahradní studia' },
      url: BASE_URL + PATH,
      offers: PARTNER_TIERS.map((tier) => ({
        '@type': 'Offer',
        name: tier.name,
        description: `${tier.for}. Partnerská hladina ${tier.margin} z katalogové ceny. ${tier.entry}.`,
        priceCurrency: 'CZK',
        priceSpecification: { '@type': 'PriceSpecification', description: `Partnerská sleva ${tier.margin} z katalogové ceny; konečnou cenu potvrzuje individuální nabídka.`, priceCurrency: 'CZK' },
        eligibleCustomerType: tier.for,
        url: `${BASE_URL}${PATH}#partnerske-ceny`,
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}${PATH}#faq`,
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}${PATH}#vizualizace`,
      contentUrl: HERO_IMAGE,
      caption: VISUALS[0].desc,
      description: VISUALS[0].alt,
    },
  ],
};

export default function RedesignSpoluprace() {
  const scope = useGsapReveal();

  useEffect(() => {
    setSEO({
      title: 'Spolupráce a partnerské ceny — mlžítka a mlžné brány',
      description: 'Partnerský program MLŽIDLA® pro architekty, města, realizační firmy a zahradní studia: technické podklady, vizualizace do vašeho prostoru, partnerské ceny a nabídka do 48 hodin.',
      keywords: 'spolupráce mlžítka, partnerský program mlžení, partnerské ceny mlžítka, mlžné brány pro architekty, velkoobchod mlžítka, HolmTec partner',
      canonicalPath: PATH,
      image: HERO_IMAGE,
      jsonLd: JSON_LD,
      geo: { placename: 'Trutnov', region: 'CZ' },
    });
  }, []);

  return (
    <div ref={scope} className="min-h-screen bg-white">
      <SpoluHero image={HERO_IMAGE} />
      <SpoluAudience />
      <SpoluVisualizations items={VISUALS} />
      <SpoluWireframe />
      <SpoluPartnerPricing />
      <SpoluOfferDraft />
      <SpoluResources />

      {/* FAQ — zdroj pro FAQPage structured data */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8" data-reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-700">Časté dotazy</p>
            <h2 className="font-heading text-3xl font-light tracking-tight text-slate-900">Ke spolupráci a cenám</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} data-reveal className="group rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-heading text-lg text-slate-900 marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm font-light leading-relaxed text-slate-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SpoluPartnerForm />
    </div>
  );
}