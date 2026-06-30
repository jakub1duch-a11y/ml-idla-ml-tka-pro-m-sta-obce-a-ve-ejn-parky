import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import ProductsSection from '@/components/home/ProductsSection';
import SmartSection from '@/components/home/SmartSection';
import VideoSection from '@/components/home/VideoSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import TechSection from '@/components/home/TechSection';
import BlogSection from '@/components/home/BlogSection';
import PromoSection from '@/components/home/PromoSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ProductsSection />
      <HowItWorksSection />
      <SmartSection />
      <VideoSection />
      <ProjectsSection />
      <ReferenceSection />
      <TechSection />
      <BlogSection />
      <PromoSection />
      <ContactSection />
    </>
  );
}