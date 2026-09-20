import React, { useMemo } from 'react';
import { Droplets, Layers3, ShieldCheck, Wrench } from 'lucide-react';

const TECHNICAL_MEDIA_RE = /(1000008748|technick|schema|schéma|edraw|vykres|výkres|montaz|montáž|instalac)/i;

export default function PdInstallationPrep({ product }) {
  const technicalMedia = useMemo(
    () => (product.gallery_urls || []).filter((url) => typeof url === 'string' && TECHNICAL_MEDIA_RE.test(url)).slice(0, 3),
    [product.gallery_urls]
  );

  const items = [
    {
      icon: ShieldCheck,
      title: 'Nerezová konstrukce',
      text: product.material || 'Materiál a povrch potvrzujeme podle konkrétního výrobku a projektu.',
    },
    {
      icon: Droplets,
      title: 'Skryté vedení vody',
      text: 'U pevné instalace vedeme přívod pod povrchem a napojujeme jej těsně nad skrytou patkou.',
    },
    {
      icon: Layers3,
      title: 'Čisté kotvení',
      text: 'Patku a kotevní prvky lze u pevné instalace skrýt do betonu pod finální povrch.',
    },
    {
      icon: Wrench,
      title: 'Trysky podle produktu',
      text: 'Typ i počet trysek určujeme výhradně podle ověřené specifikace konkrétního produktu.',
    },
  ];

  return (
    <section id="priprava-instalace" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">
              Příprava a instalace
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">
              Technika zůstává skrytá. V prostoru vynikne produkt.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[#0D2F4F]/62 sm:text-base">
            Přívod vody, kotvení i osazení trysek řešíme podle konkrétního produktu a stavební připravenosti místa. Finální technické provedení vždy potvrzuje projektová dokumentace.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <article key={title} className="border border-[#D8E8F0] bg-[#F7FBFD] p-5 sm:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F6FC] text-[#0B5EA8]">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold text-[#0A2342]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#0D2F4F]/60">{text}</p>
            </article>
          ))}
        </div>

        {technicalMedia.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-heading text-xl font-bold text-[#0A2342]">Technické schéma a montážní logika</h3>
              <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#0D2F4F]/40">Odděleno od lifestyle galerie</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technicalMedia.map((url, index) => (
                <figure key={url} className="overflow-hidden border border-[#D8E8F0] bg-[#F7FBFD]">
                  <img src={url} alt={`${product.name} — technické schéma ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full object-contain" />
                  <figcaption className="border-t border-[#D8E8F0] px-4 py-3 text-xs font-semibold text-[#0D2F4F]/65">
                    Technický podklad {index + 1}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
