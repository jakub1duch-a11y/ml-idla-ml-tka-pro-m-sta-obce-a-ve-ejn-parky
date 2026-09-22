import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Columns3,
  Droplets,
  Leaf,
  Palette,
  Route,
  ShieldCheck,
  Sparkles,
  Waves,
  Wind,
  Wifi,
} from 'lucide-react';
import { getUploadedProductPhoto } from '@/lib/uploadedProductPhotos';

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const categoryCards = [
  {
    title: 'Sloupková mlžítka',
    eyebrow: 'Rovná a designová',
    description: 'Elegantní vertikální totemy, například řada Linea, vhodné do parků, k chodníkům, lavičkám a pěším trasám. Subtilní trubka o průměru do 60 mm drží čistý architektonický výraz.',
    href: '/mlzidla-mlzitka?kategorie=sloupkova-mlzitka#catalog',
    image: getUploadedProductPhoto('sloup-detail')?.src,
    icon: Columns3,
    products: ['Linea', 'Linea CE', 'Stéblo'],
    accent: 'from-cyan-400/28 via-white/10 to-transparent',
  },
  {
    title: 'Mlžné brány a oblouky',
    eyebrow: 'Průchozí ochlazení',
    description: 'Průchozí nerezové brány pro náměstí, dětská hřiště, promenády a vstupní zóny. Přirozeně vedou pohyb lidí a vytváří místo, kam se v horku chcete vracet.',
    href: '/mlzidla-mlzitka?kategorie=mlzne-brany-a-oblouky#catalog',
    image: null,
    icon: Route,
    products: ['Gate', 'Kruh', 'Bendy Gate'],
    accent: 'from-teal-300/24 via-cyan-300/10 to-transparent',
  },
  {
    title: 'Ateliérové a tvarové prvky',
    eyebrow: 'Lízátka, TeePee, Květ',
    description: 'Netradiční umělecké a hravé nerezové tvary, které fungují jako dominanta veřejného prostoru a současně jako účinný chladič vzduchu pro děti, rodiny i městské akce.',
    href: '/mlzidla-mlzitka?kategorie=atelierove-a-tvarove-prvky#catalog',
    image: getUploadedProductPhoto('steblo-hero')?.src,
    icon: Palette,
    products: ['LOLLI', 'TeePee', 'Květ'],
    accent: 'from-sky-300/22 via-emerald-200/12 to-transparent',
  },
];

const tickerItems = [
  { icon: Wind, text: 'Příjemnější mikroklima pro horké dny' },
  { icon: ShieldCheck, text: 'Nerezová konstrukce pro veřejný prostor' },
  { icon: Wifi, text: 'Volitelné chytré řízení SUPLA' },
  { icon: Droplets, text: 'Jemná vodní mlha bez promočení' },
  { icon: Leaf, text: 'Řešení pro města, obce, parky a školy' },
  { icon: Building2, text: 'Návrh umístění podle konkrétní lokality' },
];

function MistPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
      <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="absolute right-10 top-1/3 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
    </div>
  );
}

export default function ProductCategoryExplorer() {
  const marqueeItems = [...tickerItems, ...tickerItems];

  return (
    <section id="produkty" className="relative overflow-hidden bg-[#F5FAFB] py-16 sm:py-20 lg:py-28" aria-labelledby="category-explorer-title">
      <MistPattern />
      <style>{`
        @keyframes mlzidlaMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .mlzidla-marquee-track { animation: mlzidlaMarquee 34s linear infinite; }
        }
      `}</style>

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-10 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end"
        >
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[.24em] text-[#0B8EC5]">// Kategorie produktů</p>
            <h2 id="category-explorer-title" className="mt-4 max-w-3xl font-heading text-4xl font-black leading-[.96] tracking-[-.06em] text-[#07131D] sm:text-5xl lg:text-6xl">
              Vyberte typ mlžení podle prostoru.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-[#516574] sm:text-lg">
              Pro města a obce držíme nabídku přehledně: sloupky pro čistou infrastrukturu, brány pro průchozí ochlazení a tvarové prvky pro místa, která mají mít vlastní charakter.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#07131D]/58">
              <span className="rounded-full border border-cyan-200 bg-white px-3 py-2">bez Bendy Field</span>
              <span className="rounded-full border border-cyan-200 bg-white px-3 py-2">bez míchání Linea / Bendy</span>
              <span className="rounded-full border border-cyan-200 bg-white px-3 py-2">B2G přehled</span>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {categoryCards.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.article
                key={category.title}
                custom={index}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[2rem] border border-[#D9E9EF] bg-white shadow-[0_22px_70px_rgba(7,19,29,.08)] transition-shadow duration-300 hover:shadow-[0_30px_90px_rgba(7,19,29,.14)]"
              >
                <Link to={category.href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B8EC5]">
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#07131D]">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={`${category.title} – ${category.eyebrow}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover opacity-92 transition duration-700 motion-safe:group-hover:scale-[1.075] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="h-full w-full bg-[radial-gradient(circle_at_35%_30%,rgba(34,211,238,.32),transparent_28%),linear-gradient(135deg,#07131D,#0B3F52_55%,#0E5967)]" />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.accent}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/86 via-[#07131D]/16 to-transparent" />
                    <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/22 bg-white/14 text-white shadow-[0_14px_36px_rgba(0,0,0,.22)] backdrop-blur-xl">
                      <Icon size={25} strokeWidth={1.55} />
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#8AEAF5]">{category.eyebrow}</p>
                      <h3 className="mt-2 font-heading text-3xl font-black leading-none tracking-[-.055em] sm:text-4xl">{category.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="min-h-[96px] text-sm leading-7 text-[#516574] sm:text-[15px]">
                      {category.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {category.products.map((product) => (
                        <span key={product} className="rounded-full bg-[#EAF7FA] px-3 py-1.5 text-xs font-bold text-[#0B6680]">
                          {product}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#07131D]">
                      Zobrazit řešení <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 overflow-hidden rounded-[1.5rem] border border-cyan-200/70 bg-[#07131D] py-4 text-white shadow-[0_18px_60px_rgba(7,19,29,.12)]"
        >
          <div className="mlzidla-marquee-track flex w-max items-center gap-4 whitespace-nowrap px-4">
            {marqueeItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <span key={`${item.text}-${index}`} className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[.06] px-4 py-2 text-sm font-semibold text-white/82">
                  <Icon size={16} className="text-[#22D3EE]" strokeWidth={1.8} />
                  {item.text}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
