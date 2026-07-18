import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import MistHeroBackground from '@/components/common/MistHeroBackground';
import MistBenefitsCalculator from '@/components/prinosy/MistBenefitsCalculator';
import RegionalOperatingCosts from '@/components/prinosy/RegionalOperatingCosts';
import BenefitsNavigationSection from '@/components/prinosy/BenefitsNavigationSection';

export default function Prinosy() {
  useEffect(() => { setSEO({ title: 'Přínosy mlžítek | Mlžidla.cz', description: 'Ekonomické, provozní a ekologické přínosy mlžných systémů HolmTec.', canonicalPath: '/prinosy-mlzitek' }); }, []);
  return <main className="min-h-screen bg-white"><section className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36"><MistHeroBackground /><div className="site-container relative z-10"><p className="mb-4 text-xs uppercase tracking-[.22em] text-cyan">Přínosy pro B2B</p><h1 className="max-w-4xl font-heading font-light">Mlha, která pracuje pro váš provoz.</h1><p className="mt-6 max-w-2xl text-lg text-white/65">Od vyšších tržeb až po chytrou automatizaci. Vyberte si přínos, který je pro váš projekt nejdůležitější.</p></div></section><BenefitsNavigationSection /><MistBenefitsCalculator /><RegionalOperatingCosts /></main>;
}