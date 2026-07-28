import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HeroFeatureGrid from '@/components/chytra/HeroFeatureGrid';
import ControlVariants from '@/components/chytra/ControlVariants';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import SmartControlPromo from '@/components/chytra/SmartControlPromo';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';
import SmartSavingsSection from '@/components/chytra/SmartSavingsSection';

export default function ChytraMlzidla() {
  useEffect(() => {
    setSEO({
      title: 'Chytré řízení mlzidla.cz — Smart/APP systém 2026',
      description: 'Chytré řízení mlzidla.cz — vlastní Smart/APP systém ovládání mlžítek. Wi-Fi, senzory teploty, vlhkosti a pohybu, integrace s chytrým osvětlením i smart home.',
      keywords: 'chytré řízení mlzidla, smart mlžítka, mlžení aplikace, chytré ovládání mlžení, katalog mlžítek 2026',
      canonicalPath: '/chytra-mlzidla',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroFeatureGrid />
      <ControlVariants />
      <ProductFilterGrid />
      <SmartControlPromo />
      <AccessoriesSection />
      <SmartSavingsSection />
    </div>);

}