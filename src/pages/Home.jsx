import React, { useEffect } from 'react';
import { SEO_PAGES, setSEO } from '@/lib/seo';
import HeroSlider from '@/components/home/premium/HeroSlider';
import IndustriesSection from '@/components/home/IndustriesSection';
import CustomDesignSection from '@/components/home/CustomDesignSection';
import PremiumServicesSection from '@/components/home/premium/PremiumServicesSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import UrbanCoolingImpact from '@/components/home/premium/UrbanCoolingImpact';
import SmartSection from '@/components/home/SmartSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ProjectGallerySection from '@/components/home/ProjectGallerySection';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import FadeIn from '@/components/common/FadeIn';
import AIProjectDesignerSection from '@/components/home/AIProjectDesignerSection';
import HomepageVideoLoops from '@/components/home/HomepageVideoLoops';
import FieldMediaSection from '@/components/home/FieldMediaSection';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
  }, []);

  return (
    <>
      <HeroSlider />

      <FadeIn><IndustriesSection /></FadeIn>
      <FadeIn><HomepageVideoLoops /></FadeIn>
      <FadeIn><PremiumServicesSection /></FadeIn>
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><UrbanCoolingImpact /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FieldMediaSection />
      <FadeIn><CustomDesignSection /></FadeIn>
      <AIProjectDesignerSection />
      <FadeIn><InstagramFeedSection /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <FadeIn><ProjectGallerySection /></FadeIn>
    </>
  );
}