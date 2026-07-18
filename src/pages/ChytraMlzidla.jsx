import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HeroFeatureGrid from '@/components/chytra/HeroFeatureGrid';
import ControlVariants from '@/components/chytra/ControlVariants';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import SmartControlPromo from '@/components/chytra/SmartControlPromo';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';
import SmartSavingsSection from '@/components/chytra/SmartSavingsSection';
import SmartStickyNav from '@/components/chytra/SmartStickyNav';

export default function ChytraMlzidla() {
  useEffect(() => {
    setSEO({
      title: 'Chytré řízení mlžítek — Smart/APP systém 2026',
      description: 'Smart/APP systém pro řízení mlžítek: aplikace, Wi-Fi, senzory teploty, vlhkosti a pohybu, automatické harmonogramy a přehled spotřeby.',
      keywords: 'chytré řízení mlzidla, smart mlžítka, mlžení aplikace, chytré ovládání mlžení, katalog mlžítek 2026',
      canonicalPath: '/chytra-mlzidla',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section id="smart-uvod"><HeroFeatureGrid /></section>
      <section id="smart-varianty"><ControlVariants /></section>
      <section id="smart-aplikace"><SmartControlPromo /></section>
      <section id="smart-moduly"><AccessoriesSection /></section>
      <section id="smart-uspory"><SmartSavingsSection /></section>
      <ProductFilterGrid />
      <SmartStickyNav />
    </div>);

}