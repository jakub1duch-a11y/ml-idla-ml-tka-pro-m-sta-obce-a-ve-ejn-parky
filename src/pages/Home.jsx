import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CollectionPreview from '@/components/home/CollectionPreview';
import RealizaceSection from '@/components/home/RealizaceSection';
import TechSection from '@/components/home/TechSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CollectionPreview />
      <RealizaceSection />
      <TechSection />
      <ContactSection />
    </>
  );
}