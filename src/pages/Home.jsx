import React, { useEffect } from 'react';
import { SEO_PAGES, setSEO } from '@/lib/seo';
import B2gHero from '@/components/home/b2g/B2gHero';
import AudienceFitSection from '@/components/home/b2g/AudienceFitSection';
import CityGatesSection from '@/components/home/b2g/CityGatesSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import SmartSection from '@/components/home/SmartSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import MistVideoShowcase from '@/components/common/MistVideoShowcase';
import FadeIn from '@/components/common/FadeIn';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
  }, []);

  return (
    <>
      <B2gHero />
      <FadeIn><AudienceFitSection /></FadeIn>
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><CityGatesSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><ReferenceSection /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><MistVideoShowcase /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
    </>
  );
}