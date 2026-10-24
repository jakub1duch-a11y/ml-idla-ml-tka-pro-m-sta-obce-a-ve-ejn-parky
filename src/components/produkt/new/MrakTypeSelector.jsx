import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';

const IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';

export const MRAK_TYPES = [
  {
    slug: 'mlzny-mrak-1414',
    title: 'MRAK 1414',
    size: 'cca 1 400 × 1 400 mm',
    text: 'Kompaktní tvar mraku pro školní a mateřské zahrady, terasy, zoo a menší pobytová místa. Méně trysek, nižší spotřeba vody, snadné umístění.',
    studio: IMG + 'c97e83191_generated_image.png',
    details: [
      { src: IMG + '836979b40_generated_image.png', label: 'Tryska · kužel jemné mlhy' },
      { src: IMG + '8c1d5acee_generated_image.png', label: 'Zahrada MŠ · vizualizace' },
    ],
  },
  {
    slug: 'mlzny-mrak-2424',
    title: 'MRAK 2424',
    size: 'cca 2 400 × 2 400 mm',
    text: 'Velký tvar mraku (MRAK 13R 2424) pro náměstí, parky a promenády. Více smyček a trysek, mohutnější mlžný oblak pro větší počet lidí.',
    studio: IMG + '399817aa6_generated_image.png',
    details: [
      { src: IMG + '42b2a1523_generated_image.png', label: 'Řada trysek · mlžné kužele' },
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
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {MRAK_TYPES.map((t) => {
            const selected = t.slug === slug;
            return (
              <article key={t.slug} className={`overflow-hidden rounded-[28px] border bg-[#F7FBFD] ${selected ? 'border-[#0B8EC5] shadow-md' : 'border-[#DFEAF0]'}`}>
                <div className="flex flex-wrap items-end justify-between gap-3 px-6 pt-6">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#0B8EC5]">{t.title}</p>
                    <h3 className="mt-1 font-heading text-2xl font-bold text-[#07131D]">{t.size}</h3>
                  </div>
                  {selected ? (
                    <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0B5EA8] px-4 text-xs font-bold text-white"><Check size={14} /> Zobrazený typ</span>
                  ) : (
                    <Link to={`/produkt/${t.slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#0B5EA8] px-4 text-xs font-bold text-[#0B5EA8] hover:bg-[#0B5EA8] hover:text-white">Zobrazit {t.title} <ArrowUpRight size={14} /></Link>
                  )}
                </div>
                <p className="px-6 pt-3 text-sm leading-6 text-slate-600">{t.text}</p>
                <div className="p-4 sm:p-5">
                  <img src={t.studio} alt={`${t.title} – studiová fotografie`} loading="lazy" className="h-[320px] w-full rounded-[20px] border border-[#E2EDF2] bg-white object-contain sm:h-[380px]" />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {t.details.map((d) => (
                      <figure key={d.src} className="overflow-hidden rounded-[16px] border border-[#E2EDF2] bg-white">
                        <img src={d.src} alt={`${t.title} – ${d.label}`} loading="lazy" className="aspect-[3/2] w-full object-cover" />
                        <figcaption className="px-3 py-2.5 text-[11px] font-medium text-slate-600">{d.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}