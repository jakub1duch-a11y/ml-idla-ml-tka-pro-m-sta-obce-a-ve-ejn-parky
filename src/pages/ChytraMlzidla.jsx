import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HeroFeatureGrid from '@/components/chytra/HeroFeatureGrid';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import SmartControlPromo from '@/components/chytra/SmartControlPromo';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';

export default function ChytraMlzidla() {
  useEffect(() => {
    setSEO({
      title: 'Chytrá mlžidla.cz — Katalog a nabídky 2026',
      description: 'Chytrá mlžítka se Smart App řízením — automatika dle počasí, vlhkosti i pohybu, instalace do 30 minut. Celý katalog 2026, moduly a příslušenství.',
      keywords: 'chytrá mlžidla, smart mlžítka, mlžení aplikace, chytré ovládání mlžení, katalog mlžítek 2026',
      canonicalPath: '/chytra-mlzidla',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroFeatureGrid />
      <ProductFilterGrid />
      <SmartControlPromo />
      <AccessoriesSection />
    </div>);

}