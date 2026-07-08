import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import CategorySlider from '@/components/home/CategorySlider';
import PremiumMistExperience from '@/components/home/premium/PremiumMistExperience';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import ProductsSlider from '@/components/home/ProductsSlider';
import SmartSection from '@/components/home/SmartSection';
import VideoSection from '@/components/home/VideoSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import TechSection from '@/components/home/TechSection';
import BlogSection from '@/components/home/BlogSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ContactSection from '@/components/home/ContactSection';
import FadeIn from '@/components/common/FadeIn';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <PremiumMistExperience />
      <CategorySlider />
      <HeroSection />
      <FadeIn><CategoriesSection /></FadeIn>
      <FadeIn><ProductsSlider /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><HowItWorksSection /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><VideoSection /></FadeIn>
      <FadeIn><ProjectsSection /></FadeIn>
      <FadeIn><ReferenceSection /></FadeIn>
      <FadeIn><TechSection /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
    </>
  );
}