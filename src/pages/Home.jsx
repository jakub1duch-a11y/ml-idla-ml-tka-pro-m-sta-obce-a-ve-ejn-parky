import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import CityNetworkSection from '@/components/home/new/CityNetworkSection';
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
      title: 'Městské ochlazování | Mlžidla.cz – výroba, pronájem, servis',
      description: 'Navrhneme městské ochlazování od první zóny po celou síť ochlazovacích míst. Modulární mlžítka, mlžné brány a mlhoviště z nerezu AISI 316L, Smart řízení a servis.',
      keywords: 'městské ochlazování, ochlazovací místa, mlžítka pro města, mlžné brány, mlhoviště, městský tepelný ostrov, Smart mlžení, AISI 316L',
      canonicalPath: '/',
      robots: 'index, follow',
    });
  }, []);

  return (
    <>
      <HomeHero />
      <CityNetworkSection />
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
