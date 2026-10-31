import React from 'react';
import MrakVariantCard from '@/components/produkt/new/MrakVariantCard';

const IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';

export const MRAK_TYPES = [
  {
    slug: 'mlzny-mrak-1413',
    title: 'MRAK 1413',
    size: '1 400 × 1 300 mm',
    wall: '3 mm',
    text: 'Organicky tvarovaný nerezový mrak s 5 mlžicími tryskami. Studiový náhled a dodané snímky v prostředí najdete v galerii této varianty.',
    studio: IMG + '1eb08641b_63249829_1792550648424291.jpg',
    details: [
      { src: IMG + 'c672cbe7e_619763258_1793297364176067.jpg', label: 'MRAK 1413 · v prostředí' },
      { src: IMG + 'b40910ae9_392114721_1793296371647105.jpg', label: 'MRAK 1413 · v zeleni' },
    ],
  },
  {
    slug: 'mlzny-mrak-1414',
    title: 'MRAK 1414',
    size: 'cca 1 400 × 1 400 mm',
    text: 'Kompaktní tvar mraku pro školní a mateřské zahrady, terasy, zoo a menší pobytová místa. Méně trysek, nižší spotřeba vody, snadné umístění.',
    studio: IMG + 'dc68064bf_3ba1e6151_generated_image.png',
    details: [
      { src: IMG + '836979b40_generated_image.png', label: 'Tryska · kužel jemné mlhy' },
      { src: IMG + '8c1d5acee_generated_image.png', label: 'Zahrada MŠ · vizualizace' },
    ],
  },
  {
    slug: 'mlzny-mrak-1480',
    title: 'MRAK 1480',
    size: '1 400 × 800 mm',
    wall: '3 mm',
    audience: 'Ideální pro školky a děti',
    text: 'Užší varianta pro zahrady mateřských škol a dětské pobytové zóny. Osazení trysek a kotvení upřesní návrh konkrétního místa. AI vizualizace, nikoli fotografie realizace.',
    studio: IMG + '74108bfea_generated_image.png',
    details: [
      { src: IMG + 'b1510033a_4c31ec850_generated_image.png', label: 'Tvarová předloha · AI vizualizace' },
      { src: IMG + '61a0a790b_5779ea552_generated_image.png', label: 'Pohled v prostředí · AI vizualizace' },
    ],
  },
  {
    slug: 'mlzny-mrak-2424',
    title: 'MRAK 2424',
    size: 'cca 2 400 × 2 400 mm',
    text: 'Velký tvar mraku (MRAK 13R 2424) pro náměstí, parky a promenády. Více smyček a trysek, mohutnější mlžný oblak pro větší počet lidí.',
    studio: IMG + 'cf5ed1891_ef3414919_generated_image.webp',
    details: [
      { src: IMG + '836979b40_generated_image.png', label: 'Tryska · kužel jemné mlhy' },
      { src: IMG + 'c3bec7830_generated_image.png', label: 'Alej v parku · vizualizace' },
    ],
  },
];

export default function MrakTypeSelector({ slug }) {
  return (
    <section id="tvar-mraku" className="scroll-mt-24 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0B8EC5]">MLŽNÝ MRAK · volba tvaru</p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-.035em] text-[#07131D] sm:text-4xl">Vyberte tvar mraku pro váš prostor.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Rozměry jsou návrhové, finální provedení potvrzuje výrobní výkres. Vizualizace jsou ilustrační.</p>
        <div className="mt-7 grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {MRAK_TYPES.map((variant) => (
            <MrakVariantCard key={variant.slug} variant={variant} selected={variant.slug === slug} />
          ))}
        </div>
      </div>
    </section>
  );
}