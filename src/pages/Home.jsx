import React, { useEffect } from 'react';
import { SEO_PAGES, setSEO } from '@/lib/seo';
import HeroDynamic from '@/components/home/HeroDynamic';
import StatsBar from '@/components/home/StatsBar';
import MicroclimateTrustSection from '@/components/home/MicroclimateTrustSection';
import WhoForSection from '@/components/home/WhoForSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import HowItWorksSteps from '@/components/home/HowItWorksSteps';
import RecentReferences from '@/components/home/RecentReferences';
import QuickInquiryForm from '@/components/home/QuickInquiryForm';
import MobileStickyBar from '@/components/home/MobileStickyBar';
import FadeIn from '@/components/common/FadeIn';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  useEffect(() => {
    setSEO({
      ...SEO_PAGES.home,
      title: 'MLŽIDLA.CZ | Architektonická mlžítka pro města i zahrady',
      description: 'Nerezová mlžítka a mlžné systémy pro města, školy, parky, areály a zahrady. Návrh mikroklimatu, vizualizace, smart řízení a řešení na míru.',
      canonicalPath: '/',
    });
  }, []);

  return (
    <>
      <HeroDynamic />
      <StatsBar />
      <MicroclimateTrustSection />
      <WhoForSection />
      <FeaturedProductsSection />
      <HowItWorksSteps />
      <RecentReferences />
      <QuickInquiryForm />
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <MobileStickyBar />
    </>
  );
}
