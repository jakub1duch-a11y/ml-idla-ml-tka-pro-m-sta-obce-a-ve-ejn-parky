import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import ReferencesStrip from '@/components/home/new/ReferencesStrip';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import SmartControlTeaser from '@/components/home/new/SmartControlTeaser';
import FeaturedMlzitka from '@/components/home/new/FeaturedMlzitka';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import ReferenceCards from '@/components/home/new/ReferenceCards';
import FinancingSection from '@/components/home/new/FinancingSection';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';

export default function Home() {
  useEffect(() => {
    setSEO({
      title: 'MLŽIDLA — nerezová mlžítka pro města, obce a veřejný prostor',
      description: 'Návrh, výroba v Trutnově a instalace mlžících soch pro veřejný prostor. Lokální ochlazení 2–8 °C, provoz bez elektřiny nebo se smart řízením.',
      robots: 'index, follow',
    });
  }, []);

  return (
    <>
      <HomeHero />
      <ReferencesStrip />
      <ProKohoSection />
      <MistInOperation />
      <SmartControlTeaser />
      <FeaturedMlzitka />
      <CooperationSteps />
      <ReferenceCards />
      <FinancingSection />
      <HomeInquiryForm />
      <MobileStickyBar />
    </>
  );
}