import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import LightHero from '@/components/home/light/LightHero';
import LightShowcaseBand from '@/components/home/light/LightShowcaseBand';
import LightRealizace from '@/components/home/light/LightRealizace';
import LightPartners from '@/components/home/light/LightPartners';
import LightSmartBanner from '@/components/home/light/LightSmartBanner';
import LightInfoList from '@/components/home/light/LightInfoList';

export default function Home5() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <LightHero />
      <LightShowcaseBand />
      <LightRealizace />
      <LightPartners />
      <LightSmartBanner />
      <LightInfoList />
    </>
  );
}