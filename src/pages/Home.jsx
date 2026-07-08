import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import PremiumHeroSection from '@/components/home/premium/PremiumHeroSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import SmartSection from '@/components/home/SmartSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import FadeIn from '@/components/common/FadeIn';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <PremiumHeroSection />
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><ReferenceSection /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
    </>
  );
}