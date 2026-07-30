import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OFFERS = [
  { slug: 'city', title: 'City Collection', eyebrow: 'Veřejný prostor', text: 'Odolné mlžné brány a architektonické prvky pro náměstí, parky a pěší zóny.', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6482eed7c_generated_image.png' },
  { slug: 'garden', title: 'Garden Collection', eyebrow: 'Zahrady a terasy', text: 'Elegantní nerezové prvky pro soukromé venkovní zóny, hotely a gastro provozy.', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3dd798c07_generated_image.png' },
  { slug: 'art', title: 'Art Collection', eyebrow: 'Autorské instalace', text: 'Mlžné skulptury a řešení na míru, které se stávají součástí identity konkrétního místa.', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/de82205a7_generated_image.png' }
];

export default function CollectionOffers() {
  return <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
    <div className="max-w-2xl mb-10"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-teal-700 mb-3">Kolekce MLŽIDLA®</p><h2 className="font-heading text-4xl lg:text-5xl text-slate-950">Vyberte řešení podle charakteru místa.</h2></div>
    <div className="grid gap-5 lg:grid-cols-3">{OFFERS.map((offer) => <Link key={offer.title} to={`/kolekce/${offer.slug}`} className="group border border-[#b9c3c8] bg-card overflow-hidden hover:border-secondary transition-colors">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
      <div className="p-6"><p className="font-mono text-[10px] tracking-[.16em] uppercase text-teal-700 mb-3">{offer.eyebrow}</p><h3 className="font-heading text-2xl text-slate-950">{offer.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{offer.text}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">Prohlédnout produkty <ArrowRight size={15}/></span></div>
    </Link>)}</div>
  </section>;
}