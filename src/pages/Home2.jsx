import React, { useEffect, useState } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import MistCinematicHero from '@/components/home/MistCinematicHero';
import HomeSectionNav from '@/components/home/HomeSectionNav';
import ScrollMistExperience from '@/components/home/ScrollMistExperience';
import MistBenefitsSection from '@/components/home/MistBenefitsSection';
import MistPerformanceSection from '@/components/home/MistPerformanceSection';
import SmartMicroclimateHero from '@/components/home/SmartMicroclimateHero';
import ZooPrahaShowcase from '@/components/home/ZooPrahaShowcase';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import RealizaceGallerySection from '@/components/home/RealizaceGallerySection';
import BlogSection from '@/components/home/BlogSection';

export default function Home2() {
  const [coolingTarget] = useState(() => window.innerWidth < 1024 ? 'benefit' : 'product');
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return <><MistCinematicHero /><HomeSectionNav /><MistBenefitsSection enableCooling={coolingTarget === 'benefit'} /><MistPerformanceSection /><SmartMicroclimateHero /><ScrollMistExperience /><ZooPrahaShowcase /><FeaturedProductsSection enableCooling={coolingTarget === 'product'} /><RealizaceGallerySection /><BlogSection /></>;
}