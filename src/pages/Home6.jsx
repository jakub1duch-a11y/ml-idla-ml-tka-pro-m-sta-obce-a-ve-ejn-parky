import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import Header6 from '@/components/home6/Header6';
import Hero6 from '@/components/home6/Hero6';
import FeatureCardsRow6 from '@/components/home6/FeatureCardsRow6';
import AboutSection6 from '@/components/home6/AboutSection6';
import HowItWorks6 from '@/components/home6/HowItWorks6';
import ProductsFeatureSection6 from '@/components/home6/ProductsFeatureSection6';
import FinalCta6 from '@/components/home6/FinalCta6';
import Footer from '@/components/layout/Footer';

export default function Home6() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header6 />
      <Hero6 />
      <FeatureCardsRow6 />
      <AboutSection6 />
      <HowItWorks6 />
      <ProductsFeatureSection6 />
      <FinalCta6 />
      <Footer />
    </div>
  );
}