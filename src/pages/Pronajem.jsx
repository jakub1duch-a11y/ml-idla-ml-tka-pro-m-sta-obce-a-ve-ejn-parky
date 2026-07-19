import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import RentalHero from '@/components/rental/RentalHero';
import CatalogRentalCard from '@/components/katalog/CatalogRentalCard';
import { setSEO } from '@/lib/seo';

const steps = ['Návrh zařízení podle plochy a návštěvnosti', 'Doprava, instalace a zprovoznění', 'Technická podpora a demontáž po akci'];

export default function Pronajem() {
  useEffect(() => setSEO({ title: 'Pronájem mlžítek pro eventy a festivaly | Mlžidla.cz', description: 'Pronájem mobilních mlžítek a mlžných bran včetně návrhu, dopravy, instalace a technické podpory.', canonicalPath: '/pronajem' }), []);
  return <main className="min-h-screen bg-white"><RentalHero /><section className="site-container py-16 lg:py-20"><p className="content-eyebrow">Kompletní služba</p><h2 className="content-title mt-3">Ochlazení akce bez starostí.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{steps.map((step, index) => <article key={step} className="rounded-2xl border border-slate-200 p-6"><CheckCircle2 className="text-techblue" /><p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">0{index + 1}</p><h3 className="mt-2 text-lg text-slate-950">{step}</h3></article>)}</div></section><CatalogRentalCard /></main>;
}