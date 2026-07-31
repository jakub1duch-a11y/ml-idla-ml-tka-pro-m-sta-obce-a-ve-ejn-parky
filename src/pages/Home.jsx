import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import HeroSlider from '@/components/home/premium/HeroSlider';
import PremiumServicesSection from '@/components/home/premium/PremiumServicesSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import UrbanCoolingImpact from '@/components/home/premium/UrbanCoolingImpact';
import SmartSection from '@/components/home/SmartSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import ConceptToRealitySection from '@/components/home/ConceptToRealitySection';
import MistVideoShowcase from '@/components/common/MistVideoShowcase';
import FadeIn from '@/components/common/FadeIn';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <HeroSlider />
      <FadeIn><PremiumServicesSection /></FadeIn>
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><UrbanCoolingImpact /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><MistVideoShowcase /></FadeIn>
      <FadeIn><InstagramFeedSection /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <FadeIn><ConceptToRealitySection /></FadeIn>
      <FadeIn><ReferenceSection /></FadeIn>
    </>
  );
}