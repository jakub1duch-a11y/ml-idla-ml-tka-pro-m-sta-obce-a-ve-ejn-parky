import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProductsSection from '@/components/home/ProductsSection';
import SmartSection from '@/components/home/SmartSection';
import RealizaceSection from '@/components/home/RealizaceSection';
import TechSection from '@/components/home/TechSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoSection from '@/components/home/PromoSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <SmartSection />
      <RealizaceSection />
      <TechSection />
      <FeaturedProducts />
      <PromoSection />
      <ContactSection />
    </>
  );
}