import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import HeroSlider from '@/components/home/premium/HeroSlider';
import PremiumServicesSection from '@/components/home/premium/PremiumServicesSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import SmartSection from '@/components/home/SmartSection';
import MobileQuickNav from '@/components/home/MobileQuickNav';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import RealizaceGallerySection from '@/components/home/RealizaceGallerySection';
import FadeIn from '@/components/common/FadeIn';

export default function Home2() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <HeroSlider />
      <MobileQuickNav />
      <FadeIn><PremiumServicesSection /></FadeIn>
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><InstagramFeedSection /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <FadeIn><RealizaceGallerySection /></FadeIn>
    </>
  );
}