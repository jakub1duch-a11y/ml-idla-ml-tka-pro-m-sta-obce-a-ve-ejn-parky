import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProductsSection from '@/components/home/ProductsSection';
import SmartSection from '@/components/home/SmartSection';
import VideoSection from '@/components/home/VideoSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import TechSection from '@/components/home/TechSection';
import BlogSection from '@/components/home/BlogSection';
import PromoSection from '@/components/home/PromoSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <SmartSection />
      <VideoSection />
      <ProjectsSection />
      <TechSection />
      <BlogSection />
      <PromoSection />
      <ContactSection />
    </>
  );
}