import React from 'react';
import { ArrowRight, Building2, DraftingCompass, Store, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  { icon: Store, title: 'Distributoři a prodejci', text: 'B2B ceník, obchodní podklady, školení a ochrana příležitostí.', to: '/partnerstvi/distributori' },
  { icon: DraftingCompass, title: 'Architekti a projektanti', text: 'Technické podklady, konzultace detailů a zakázkové provedení.', to: '/partnerstvi/architekti' },
  { icon: Wrench, title: 'Montážní a servisní firmy', text: 'Školení, partnerské ceny komponentů a technická podpora.', to: '/partnerstvi/montazni' },
  { icon: Building2, title: 'Města a veřejný sektor', text: 'Variantní návrh, rozpočtový podklad, dodání a sezónní servis.', to: '/partnerstvi/verejny-sektor' },
];

export default function PartnershipProgramGrid() {
  return <section className="border-b border-slate-200 bg-white py-16 lg:py-20"><div className="site-container"><p className="content-eyebrow">Partnerské programy</p><h2 className="mt-3 max-w-3xl text-slate-950">Vyberte spolupráci podle své role.</h2><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{programs.map(({ icon: Icon, title, text, to }) => <Link key={to} to={to} className="group border border-slate-200 p-6 transition hover:border-techblue"><Icon className="text-techblue" /><h3 className="mt-5 text-xl text-slate-950">{title}</h3><p className="mt-3 text-sm text-slate-600">{text}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-950">Detail programu <ArrowRight size={15} /></span></Link>)}</div></div></section>;
}