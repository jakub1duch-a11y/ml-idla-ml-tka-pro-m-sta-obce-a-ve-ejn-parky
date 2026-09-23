import React, { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import ReferencesStrip from '@/components/home/new/ReferencesStrip';
import V3EditorialBridge from '@/components/home/new/V3EditorialBridge';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import ProductCategoryExplorer from '@/components/kolekce/ProductCategoryExplorer';
import ProductPhotoGallery from '@/components/home/new/ProductPhotoGallery';
import MunicipalUseCasesSection from '@/components/home/new/MunicipalUseCasesSection';
import SmartControlTeaser from '@/components/home/new/SmartControlTeaser';
import FeaturedMlzitka from '@/components/home/new/FeaturedMlzitka';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import ReferenceCards from '@/components/home/new/ReferenceCards';
import FinancingSection from '@/components/home/new/FinancingSection';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import HomeMist3DScene from '@/components/home/new/HomeMist3DScene';
import HomeSpatialConfigurations from '@/components/home/new/HomeSpatialConfigurations';
import HomeGsapMotion from '@/components/home/new/HomeGsapMotion';

export default function Home() {
  useEffect(() => {
    setSEO({
      title: 'Mlžítka pro města, chytré mlžné brány a vodní mlha | MLŽIDLA.cz',
      description: 'Nízkotlaká mlžítka pro města, ochlazování náměstí, osvěžení na sportovištích, vodní mlha na veřejná prostranství a chytré řízení SUPLA.',
      keywords: 'mlžítka, mlžítka pro města, ochlazování náměstí, osvěžení na sportovištích, vodní mlha na veřejná prostranství, chytré mlžné brány, ochlazování městských prostorů, SUPLA řízení mlžení',
      canonicalPath: '/',
      robots: 'index, follow',
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <HomeGsapMotion />
      <HomeHero />
      <HomeMist3DScene />
      <ProductCategoryExplorer />
      <HomeSpatialConfigurations />
      <MunicipalUseCasesSection />
      <ProductPhotoGallery />
      <V3EditorialBridge />
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
    </MotionConfig>
  );
}