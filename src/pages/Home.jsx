import React, { useEffect } from 'react';
import { SEO_PAGES, setSEO } from '@/lib/seo';
import HeroDynamic from '@/components/home/HeroDynamic';
import StatsBar from '@/components/home/StatsBar';
import WhoForSection from '@/components/home/WhoForSection';
import HowItWorksSteps from '@/components/home/HowItWorksSteps';
import RecentReferences from '@/components/home/RecentReferences';
import QuickInquiryForm from '@/components/home/QuickInquiryForm';
import MobileStickyBar from '@/components/home/MobileStickyBar';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import FadeIn from '@/components/common/FadeIn';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
  }, []);

  return (
    <>
      <HeroDynamic />
      <StatsBar />
      <WhoForSection />
      <FeaturedProductsSection />
      <HowItWorksSteps />
      <RecentReferences />
      <FadeIn><BlogSection /></FadeIn>
      <QuickInquiryForm />
      <FadeIn><ContactSection /></FadeIn>
      <MobileStickyBar />
    </>
  );
}