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
  Wifi } from
'lucide-react';
import { getUploadedProductPhoto } from '@/lib/uploadedProductPhotos';

const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  })
};

const categoryCards = [
{
  title: 'Sloupková mlžítka',
  eyebrow: 'Rovná a designová',
  description: 'Elegantní vertikální totemy, například řada Linea, vhodné do parků, k chodníkům, lavičkám a pěším trasám. Subtilní trubka o průměru do 60 mm drží čistý architektonický výraz.',
  href: '/sloupkova-mlzitka',
  image: getUploadedProductPhoto('sloup-detail')?.src,
  icon: Columns3,
  products: ['Linea', 'Linea CE', 'Stéblo'],
  accent: 'from-cyan-400/28 via-white/10 to-transparent'
},
{
  title: 'Mlžné brány a oblouky',
  eyebrow: 'Průchozí ochlazení',
  description: 'Průchozí nerezové brány pro náměstí, dětská hřiště, promenády a vstupní zóny. Přirozeně vedou pohyb lidí a vytváří místo, kam se v horku chcete vracet.',
  href: '/mlzne-brany',
  image: null,
  icon: Route,
  products: ['Gate', 'Kruh', 'Bendy Gate'],
  accent: 'from-teal-300/24 via-cyan-300/10 to-transparent'
},
{
  title: 'Ateliérové a tvarové prvky',
  eyebrow: 'Lízátka, TeePee, Květ',
  description: 'Netradiční umělecké a hravé nerezové tvary, které fungují jako dominanta veřejného prostoru a současně jako účinný chladič vzduchu pro děti, rodiny i městské akce.',
  href: '/atelierove-prvky',
  image: getUploadedProductPhoto('steblo-hero')?.src,
  icon: Palette,
  products: ['LOLLI', 'TeePee', 'Květ'],
  accent: 'from-sky-300/22 via-emerald-200/12 to-transparent'
}];


const tickerItems = [
{ icon: Wind, text: 'Příjemnější mikroklima pro horké dny' },
{ icon: ShieldCheck, text: 'Nerezová konstrukce pro veřejný prostor' },
{ icon: Wifi, text: 'Volitelné chytré řízení SUPLA' },
{ icon: Droplets, text: 'Jemná vodní mlha bez promočení' },
{ icon: Leaf, text: 'Řešení pro města, obce, parky a školy' },
{ icon: Building2, text: 'Návrh umístění podle konkrétní lokality' }];


function MistPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-80">
      <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="absolute right-10 top-1/3 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
    </div>);

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
          className="mb-10 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          
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
              
              
              
            </div>
          </div>
        </motion.div>

        
























































        

        

















        
      </div>
    </section>);

}