import React from 'react';
import { BENDY_SLUGS } from '@/lib/newMedia';

const BENDY_VARIANTS = [
  { code: 'BENDY_60', title: 'TR60, 3×3', desc: 'Výška 1 800 mm. Kompaktní organický tvar pro intimnější prostory a zahrady.' },
  { code: 'BENDY_76', title: 'TR76×3', desc: 'Výška 2 000 mm. Výraznější objem pro náměstí, parky a promenády.' },
  { code: 'BENDY ARC', title: 'Zakázkový oblouk', desc: 'Geometrie navržená na míru prostoru a identitě místa.' },
];

export default function PdVariants({ product }) {
  const isBendy = BENDY_SLUGS.includes(product.slug);

  let variants;
  if (isBendy) {
    variants = BENDY_VARIANTS;
  } else {
    const usageMap = {
      city: [
        { code: 'Náměstí', title: 'Solitér / dvojice', desc: 'Jednotlivé prvky nebo páry pro centrální prostranství.' },
        { code: 'Park', title: 'Alej / linie', desc: 'Řada prvků podél pěší trasy nebo promenády.' },
        { code: 'Zóna', title: 'Mlžný ostrov', desc: 'Skupinové uspořádání pro lokální ochlazovací zónu.' },
      ],
      garden: [
        { code: 'Zahrada', title: 'Solitér', desc: 'Samostatný prvek jako součást zahradní kompozice.' },
        { code: 'Terasa', title: 'Pár', desc: 'Dva prvky pro ochlazení posezení.' },
        { code: 'Alej', title: 'Linie', desc: 'Řada propojených prvků podél cesty.' },
      ],
      art: [
        { code: 'Zakázkový', title: 'Vlastní tvar', desc: 'Geometrie navržená podle konkrétního zadání.' },
        { code: 'Skulptura', title: 'Unikát', desc: 'Jednorázové umělecké provedení.' },
        { code: 'Instalace', title: 'Soubor', desc: 'Sestava více prvků jako prostorová instalace.' },
      ],
    };
    variants = usageMap[product.category_id] || usageMap.city;
  }

  return (
    <section className="bg-[#EAF5FB] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Varianty / použití</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">Možnosti provedení</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {variants.map((v, i) => (
            <div key={v.code} className="border border-[#0B5EA8]/15 bg-white p-7">
              <span className="font-mono text-sm text-[#0B5EA8]">0{i + 1}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[#0D2F4F]">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#0D2F4F]/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}