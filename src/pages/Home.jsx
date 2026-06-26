import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CatalogPreview from '@/components/home/CatalogPreview';
import ServicesSection from '@/components/home/ServicesSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CatalogPreview />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}