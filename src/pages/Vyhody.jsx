import React, { useEffect } from 'react';
import { Building2, Droplets, Leaf, Radio, Snowflake, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import BrandFeatureGrid from '@/components/brand/BrandFeatureGrid';

const BENEFITS = [
  { icon: Snowflake, title: 'Až −10 °C', text: 'Jemná mlha snižuje pocitovou teplotu v místech, kde lidé tráví čas.', code: '01 / CHLAZENÍ' },
  { icon: Droplets, title: 'Úsporný provoz', text: 'Evaporační princip využívá vodu cíleně a bez potřeby klimatizace.', code: '02 / VODA' },
  { icon: ShieldCheck, title: 'Nerez AISI 316L', text: 'Materiál určený pro dlouhou životnost ve venkovním prostředí.', code: '03 / MATERIÁL' },
  { icon: Radio, title: 'Chytré řízení', text: 'Systém lze přizpůsobit podmínkám prostoru, provozu i počasí.', code: '04 / ŘÍZENÍ' }
];

export default function Vyhody() {
  useEffect(() => setSEO({ title: 'Výhody architektonického mlžení | MLŽIDLA®', description: 'Chlazení veřejného prostoru jemnou mlhou, nerezovou konstrukcí a úsporným provozem.', canonicalPath: '/vyhody' }), []);
  return <main className="bg-background pt-16"><section className="bg-primary text-primary-foreground"><div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Proč MLŽIDLA®</p><h1 className="mt-5 max-w-4xl font-heading text-5xl lg:text-7xl">Méně horka. Více života venku.</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">Technické řešení, které ochlazuje veřejný prostor a zároveň se stává jeho přirozenou součástí.</p></div></section><section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24"><BrandFeatureGrid items={BENEFITS}/></section><section className="border-y border-[#b9c3c8] bg-card"><div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-10 lg:grid-cols-[1fr_2fr]"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Pro veřejný prostor</p><div className="grid gap-8 sm:grid-cols-3">{[[Building2, 'Města', 'Komfortnější náměstí, parky a pěší zóny.'], [Leaf, 'Krajina', 'Jemný zásah do architektury i okolní zeleně.'], [Snowflake, 'Lidé', 'Příjemný důvod zůstat venku déle.']].map(([Icon, title, text]) => <div key={title}><Icon size={20} className="text-secondary" strokeWidth={1.5}/><h2 className="mt-5 font-heading text-xl text-foreground">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</div></div></section><div className="max-w-7xl mx-auto px-6 lg:px-10 py-16"><Link to="/poptavka" className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-secondary">Navrhnout řešení pro váš prostor <ArrowRight size={16}/></Link></div></main>;
}