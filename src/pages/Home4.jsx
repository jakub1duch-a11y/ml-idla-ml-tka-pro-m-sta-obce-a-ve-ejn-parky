import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import DarkHero from '@/components/home/darkglass/DarkHero';
import DarkInfoSection from '@/components/home/darkglass/DarkInfoSection';

export default function Home4() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <DarkHero />
      <DarkInfoSection />
    </>
  );
}