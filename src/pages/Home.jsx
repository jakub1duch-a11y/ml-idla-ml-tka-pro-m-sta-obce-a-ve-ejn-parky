import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import ReferencesStrip from '@/components/home/new/ReferencesStrip';
import V3EditorialBridge from '@/components/home/new/V3EditorialBridge';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import SmartControlTeaser from '@/components/home/new/SmartControlTeaser';
import SmartUseCasesExperience from '@/components/home/new/SmartUseCasesExperience';
import FeaturedMlzitka from '@/components/home/new/FeaturedMlzitka';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import ReferenceCards from '@/components/home/new/ReferenceCards';
import FinancingSection from '@/components/home/new/FinancingSection';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';

export default function Home() {
  useEffect(() => {
    setSEO({
      title: 'Mlžítka, mlžné brány a mlhoviště pro města i zahrady',
      description: 'Nerezová mlžítka, mlžné brány a mlhoviště pro města, parky, zahrady, terasy a pergoly. Projektová podpora, výroba HolmTec a Smart řízení.',
      keywords: 'mlžítka, mlžná brána, mlhoviště, vodní mlha na terasu, zahradní mlžítko, městské mlžítko',
      canonicalPath: '/',
      robots: 'index, follow',
    });
  }, []);

  return (
    <>
      <HomeHero />
      <V3EditorialBridge />
      <ReferencesStrip />
      <ProKohoSection />
      <MistInOperation />
      <SmartControlTeaser />
      <SmartUseCasesExperience compact />
      <FeaturedMlzitka />
      <CooperationSteps />
      <ReferenceCards />
      <FinancingSection />
      <HomeInquiryForm />
      <MobileStickyBar />
    </>
  );
}