import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Wind, CloudSun, MapPin } from 'lucide-react';
import { isProductMediaAllowed } from '@/lib/productMediaGuard';
import { responsiveProductSrcSet } from '@/lib/responsiveProductMedia';

/**
 * Editorial planning advice for existing low-pressure misting product pages.
 * The diagram illustrates relationships only — never geometry, spray radius or a safe distance.
 * Product image is taken from the same product record and left unaltered.
 */
const CONDITIONS = [
  {
    icon: Sun,
    number: '01',
    title: 'Horko a slunce',
    text: 'Za horkých a sušších dnů se jemná mlha obvykle rychleji odpařuje. Výsledek však závisí také na průtoku, směru trysek a nastavení provozu.',
  },
  {
    icon: Wind,
    number: '02',
    title: 'Proudění vzduchu',
    text: 'Vítr může mlhu zanést i několik metrů od mlžítka. Při návrhu proto posuzujeme převládající směr větru a návaznost na okolní posezení.',
  },
  {
    icon: CloudSun,
    number: '03',
    title: 'Vlhkost a povrchy',
    text: 'V chladnějším nebo vlhčím počasí může docházet ke smáčení povrchu. Suchou zem nelze garantovat za všech provozních podmínek.',
  },
];

function PlacementDiagram() {
  return (
    <figure className="relative overflow-hidden rounded-[1.5rem] border border-[#CFDEE4] bg-[#F4F8F9] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#235365]">Princip umístění</span>
        <span className="text-[11px] text-[#4A6570]">Schéma bez měřítka</span>
      </div>
      <svg
        viewBox="0 0 600 350"
        role="img"
        aria-label="Orientační schéma: mlžítko je umístěné mimo posezení. Směr šíření mlhy se může měnit podle větru. Vyobrazení není v měřítku."
        className="h-auto w-full"
      >
        <defs>
          <pattern id="pd-placement-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#D9E5E9" strokeWidth="1"/>
          </pattern>
          <linearGradient id="pd-placement-flow" x1="0" x2="1">
            <stop offset="0" stopColor="#55B7C8" stopOpacity=".27"/>
            <stop offset=".7" stopColor="#55B7C8" stopOpacity=".09"/>
            <stop offset="1" stopColor="#55B7C8" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <rect width="600" height="350" rx="18" fill="url(#pd-placement-grid)"/>

        <g transform="translate(362 38)">
          <rect x="0" y="0" width="210" height="255" rx="16" fill="#FFFFFF" stroke="#B4CBD3" strokeWidth="2"/>
          <text x="105" y="26" fontSize="13" fill="#183747" textAnchor="middle" fontWeight="600">Prostor pro posezení</text>
          {[75,158].map((x) => (
            <g key={x} transform={`translate(${x} 97)`} fill="none" stroke="#65818D" strokeWidth="2.1">
              <circle r="22" fill="#E8EEF0"/>
              <rect x="-22" y="-49" width="44" height="12" rx="4" fill="#F3F6F7"/>
              <rect x="-22" y="37" width="44" height="12" rx="4" fill="#F3F6F7"/>
            </g>
          ))}
          <path d="M25 198H187" stroke="#B7C9D0" strokeWidth="1.5" strokeDasharray="5 5"/>
          <text x="105" y="222" fontSize="12" fill="#486774" textAnchor="middle">Zachovat vhodný odstup</text>
        </g>

        <path d="M96 150C165 85 280 80 390 110C298 158 225 185 118 203Z" fill="url(#pd-placement-flow)"/>
        <path d="M97 170C184 135 246 115 326 116" fill="none" stroke="#20859C" strokeWidth="2.5" strokeDasharray="8 9"/>
        <path d="M315 107L328 116L313 125" stroke="#20859C" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

        <circle cx="96" cy="170" r="39" fill="#FFFFFF" stroke="#217F96" strokeWidth="2.5"/>
        <circle cx="96" cy="170" r="15" fill="#D2F0F5" stroke="#217F96" strokeWidth="2.2"/>
        <circle cx="96" cy="170" r="4.5" fill="#217F96"/>
        <text x="96" y="231" fontSize="15" fontWeight="700" fill="#163747" textAnchor="middle">Mlžítko</text>
        <text x="96" y="250" fontSize="12" fill="#4A6570" textAnchor="middle">symbolická poloha</text>

        <path d="M120 290L252 266" stroke="#5D7B87" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M238 260L253 266L242 279" stroke="#5D7B87" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="137" y="322" fontSize="12" fill="#36525E">Proměnlivý vítr</text>
      </svg>
      <figcaption className="mt-3 border-t border-[#D7E5E9] pt-3 text-xs leading-5 text-[#536A74]">
        Směr a rozsah šíření jsou pouze názorné. Schéma neurčuje skutečný dosah mlhy ani minimální instalační vzdálenost.
      </figcaption>
    </figure>
  );
}

export default function PdPlacementGuide({ product }) {
  const slug = product?.slug || '';
  const picture = (product?.hero_visual_verified && product?.hero_product_image_url) || product?.image_url || '';
  const image = typeof picture === 'string' && isProductMediaAllowed(product, picture, product?.name) ? picture : '';

  return (
    <section id="umisteni" aria-labelledby="pd-placement-heading" className="scroll-mt-36 bg-[#F5F8F9] py-16 text-[#0A2536] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid items-end gap-5 border-b border-[#D2E2E7] pb-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.19em] text-[#176A7D]">Umístění a provoz</p>
            <h2 id="pd-placement-heading" className="mt-4 max-w-[18ch] font-heading text-[clamp(2.1rem,4.3vw,3.7rem)] font-semibold leading-[1.08] tracking-[-.045em]">
              Mlha má osvěžit prostor. Ne zasahovat přímo do posezení.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-[#4E6570]">
            U nízkotlakých mlžítek obvykle nedoporučujeme umístění přímo mezi stoly a lavičky. Mlha se pohybuje s prouděním vzduchu, proto konkrétní polohu volíme podle prostoru, trysek a převládajícího větru.
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-[.84fr_1.16fr]">
          <div className="flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#CFDEE4] bg-white">
            {image ? (
              <div className="relative flex min-h-[290px] flex-1 items-center justify-center bg-[#EAF2F4] p-5 sm:min-h-[360px]">
                <img src={image} srcSet={responsiveProductSrcSet(image)} sizes="(max-width:1024px) 100vw, 42vw" width="900" height="900"
                  alt={product?.image_alt || `${product?.name || 'Mlžítko'} – stávající produktový podklad`}
                  loading="lazy" decoding="async" className="max-h-[380px] w-full object-contain"/>
              </div>
            ) : (
              <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center bg-[#EAF2F4] p-8 text-center">
                <MapPin size={28} className="text-[#176A7D]" aria-hidden="true"/>
                <p className="mt-4 max-w-xs text-sm text-[#45616C]">Vhodnou fotografii konkrétního provedení doplníme po ověření zdroje.</p>
              </div>
            )}
            <div className="p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#176A7D]">Konkrétní výrobek</p>
              <h3 className="mt-1 font-heading text-xl font-semibold">{product?.name || 'Mlžítko'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#546B75]">Zobrazený podklad pochází z aktuální produktové prezentace. Umístění v prostoru navrhujeme individuálně.</p>
            </div>
          </div>
          <PlacementDiagram />
        </div>

        <div className="mt-10 grid gap-0 border-y border-[#D4E3E8] md:grid-cols-3">
          {CONDITIONS.map(({ icon: Icon, number, title, text }) => (
            <article key={number} className="flex gap-4 border-b border-[#D4E3E8] px-1 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
              <Icon size={23} className="mt-1 shrink-0 text-[#19798D]" strokeWidth={1.5} aria-hidden="true"/>
              <div>
                <p className="text-[10px] font-semibold tracking-[.16em] text-[#62818C]">{number} / PODMÍNKY</p>
                <h3 className="mt-2 font-heading text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#506B76]">{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#0B3044] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="font-heading text-xl font-semibold sm:text-2xl">Kam mlžítko umístit ve vašem projektu?</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">Pošlete fotografii místa, přibližné rozměry a informaci o posezení. Doporučíme umístění a vhodné provedení.</p>
          </div>
          <Link to={`/poptavka?produkt=${encodeURIComponent(slug)}`}
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#A2E7F0] px-5 py-3 text-sm font-bold text-[#072639] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto">
            Posoudit umístění <ArrowRight size={17} aria-hidden="true"/>
          </Link>
        </div>
      </div>
    </section>
  );
}
