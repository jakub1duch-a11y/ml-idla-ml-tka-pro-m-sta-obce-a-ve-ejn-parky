import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Smartphone, WalletCards } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import MistHeroBackground from '@/components/common/MistHeroBackground';
import MistBenefitsCalculator from '@/components/prinosy/MistBenefitsCalculator';

const items = [
  { title: 'Zvýšení tržeb a prodeje', text: 'Plnější terasa, delší pobyt hostů a silnější viditelnost z ulice.', path: '/prinosy-mlzitek/zvyseni-trzeb-a-prodeje', icon: BarChart3 },
  { title: 'Automatizace provozu', text: 'SMART APP a meteočidla řídí mlžení bez další práce personálu.', path: '/prinosy-mlzitek/automatizace-provozu', icon: Smartphone },
  { title: 'Zabezpečení a shoda', text: 'Filtrace, hygiena vody a jasný dohled pro veřejný prostor.', path: '/prinosy-mlzitek/zabezpeceni-a-shoda', icon: ShieldCheck },
  { title: 'Snižování nákladů', text: 'Přesně řízená spotřeba a nerezová konstrukce na dlouhé roky.', path: '/prinosy-mlzitek/snizovani-provoznich-nakladu', icon: WalletCards },
];

export default function Prinosy() {
  useEffect(() => { setSEO({ title: 'Přínosy mlžítek | Mlžidla.cz', description: 'Ekonomické, provozní a ekologické přínosy mlžných systémů HolmTec.', canonicalPath: '/prinosy-mlzitek' }); }, []);
  return <main className="min-h-screen bg-white"><section className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36"><MistHeroBackground /><div className="site-container relative z-10"><p className="mb-4 text-xs uppercase tracking-[.22em] text-cyan">Přínosy pro B2B</p><h1 className="max-w-4xl font-heading font-light">Mlha, která pracuje pro váš provoz.</h1><p className="mt-6 max-w-2xl text-lg text-white/65">Od vyšších tržeb až po chytrou automatizaci. Vyberte si přínos, který je pro váš projekt nejdůležitější.</p></div></section><MistBenefitsCalculator /><section className="site-container py-14 lg:py-20"><div className="grid gap-4 md:grid-cols-2">{items.map((item) => <Link key={item.path} to={item.path} className="group flex gap-5 border border-slate-200 p-7 transition-colors hover:border-slate-950 hover:bg-slate-950"><item.icon size={25} className="shrink-0 text-[#0070F3]" /><div><h2 className="m-0 text-xl font-medium text-slate-950 group-hover:text-white">{item.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500 group-hover:text-white/60">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 group-hover:text-cyan">Zjistit více <ArrowRight size={15} /></span></div></Link>)}</div></section></main>;
}