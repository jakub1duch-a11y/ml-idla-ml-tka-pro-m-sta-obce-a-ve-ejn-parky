import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import MistCinematicHero from '@/components/home/MistCinematicHero';
import ScrollMistExperience from '@/components/home/ScrollMistExperience';
import MistBenefitsSection from '@/components/home/MistBenefitsSection';
import ZooPrahaShowcase from '@/components/home/ZooPrahaShowcase';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import RealizaceGallerySection from '@/components/home/RealizaceGallerySection';

export default function Home2() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return <><MistCinematicHero /><MistBenefitsSection /><ScrollMistExperience /><ZooPrahaShowcase /><FeaturedProductsSection /><RealizaceGallerySection /></>;
}