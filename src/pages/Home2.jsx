import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import ModernHero from '@/components/modern-home/ModernHero';
import TechnologySection from '@/components/modern-home/TechnologySection';
import SmartSection from '@/components/modern-home/SmartSection';
import UseCasesSection from '@/components/modern-home/UseCasesSection';
import HomeCta from '@/components/modern-home/HomeCta';

export default function Home2() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return <div className="bg-white"><ModernHero /><TechnologySection /><SmartSection /><UseCasesSection /><HomeCta /></div>;
}