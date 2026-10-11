import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Návrhové AI vizualizace. Podklady z /public/media/products/mrak/ se dodávají v balíčku
// MLZNY_MRAK_nahledy_a_vizualizace.zip, ale nesmí se považovat za ověřené výrobní fotografie.
const MRAK_SCENES = [
  {
    id: 'maly',
    title: 'MALÝ',
    size: 'h 1 600 mm',
    note: 'Návrhová výška dle zadání – čeká na potvrzení výrobním výkresem.',
    pictures: [
      { src: '/media/products/mrak/mrak_maly_produkt.webp', fallback: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp', label: 'Náhled produktu' },
      { src: '/media/products/mrak/mrak_maly_skolni_zahrada.webp', fallback: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp', label: 'Školní zahrada' },
      { src: '/media/products/mrak/mrak_maly_terasa.webp', fallback: '/media/optimized/7016348c6_generated_image.webp', label: 'Terasa a zahrada' },
    ],
  },
  {
    id: 'velky',
    title: 'VELKÝ',
    size: 'h 2 400 mm',
    note: 'Výška dle kalkulace MRAK 13R 2424. Počet trysek a profil výrobně upřesnit.',
    pictures: [
      { src: '/media/products/mrak/mrak_velky_produkt.webp', fallback: 'https://drive.google.com/thumbnail?id=1XCICLc8JXvcM1pV9NTHygwNisYz1TS6F&sz=w1600', label: 'Náhled produktu' },
      { src: '/media/products/mrak/mrak_velky_namesti.webp', fallback: 'https://drive.google.com/thumbnail?id=1XCICLc8JXvcM1pV9NTHygwNisYz1TS6F&sz=w1600', label: 'Městské náměstí' },
      { src: '/media/products/mrak/mrak_velky_park.webp', fallback: 'https://drive.google.com/thumbnail?id=1UBgJ6_7XuIxeDOBz-4LU0Onzjd1hb1Kt&sz=w1600', label: 'Park a promenáda' },
    ],
  },
];

function Photo({ picture, alt, className }) {
  const [src, setSrc] = useState(picture.src);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => { if (src !== picture.fallback) setSrc(picture.fallback); }}
      className={className}
    />
  );
}

export default function MrakVariantGallery() {
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant') === 'velky' ? 'velky' : 'maly';

  return (
    <section id="mrak-varianty-vizualizace" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0B8EC5]">MLŽNÝ MRAK · vizualizace variant</p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-.035em] text-[#07131D] sm:text-4xl">
          Dvě velikosti. Mlha pro každý prostor.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Produktové náhledy a inspirace pro umístění ve školní zahradě, na terase,
          náměstí a v parku. Vizualizace jsou ilustrační, nikoliv výrobní výkresy.
        </p>

        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {MRAK_SCENES.map((scene) => {
            const selected = variant === scene.id;
            const next = new URLSearchParams(searchParams);
            next.set('variant', scene.id);
            return (
              <article key={scene.id} className={`overflow-hidden rounded-[28px] border bg-[#F7FBFD] shadow-sm ${selected ? 'border-[#0B8EC5]' : 'border-[#DFEAF0]'}`}>
                <div className="flex flex-wrap items-end justify-between gap-3 px-5 pb-5 pt-6 sm:px-7">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[.15em] text-[#0B8EC5]">{scene.title}</p>
                    <h3 className="mt-1 font-heading text-2xl font-bold text-[#07131D]">{scene.size}</h3>
                  </div>
                  <Link
                    to={`/produkt/mlzitko-mrak?${next.toString()}#prehled`}
                    aria-current={selected ? 'page' : undefined}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#0B5EA8] px-4 py-2 text-xs font-bold text-[#0B5EA8] hover:bg-[#0B5EA8] hover:text-white"
                  >
                    {selected ? 'Vybraná varianta' : 'Vybrat variantu'} <ArrowUpRight size={14} />
                  </Link>
                </div>
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <figure className="overflow-hidden rounded-[20px] border border-[#E2EDF2] bg-white">
                    <Photo
                      picture={scene.pictures[0]}
                      alt={`MLŽNÝ MRAK ${scene.title} – ilustrační náhled nerezové skulptury`}
                      className="h-[310px] w-full object-contain sm:h-[390px]"
                    />
                    <figcaption className="px-4 py-3 text-[11px] font-medium text-slate-600">Produktový náhled</figcaption>
                  </figure>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {scene.pictures.slice(1).map((picture) => (
                      <figure key={picture.label} className="overflow-hidden rounded-[16px] border border-[#E2EDF2] bg-white">
                        <Photo
                          picture={picture}
                          alt={`MLŽNÝ MRAK ${scene.title} – návrhová vizualizace: ${picture.label}`}
                          className="aspect-[3/2] w-full object-cover"
                        />
                        <figcaption className="px-3 py-2.5 text-[11px] font-medium text-slate-600">{picture.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <p className="mt-3 px-1 text-[11px] leading-5 text-slate-500">{scene.note}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
