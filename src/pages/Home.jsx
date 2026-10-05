import React, { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import HomeMagazineSections from '@/components/home/new/HomeMagazineSections';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import ProductPhotoGallery from '@/components/home/new/ProductPhotoGallery';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import SmartControlTeaser from '@/components/home/new/SmartControlTeaser';
import '@/styles/reference-motion.css';

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
      <HomeHero />
      <ProKohoSection />
      <ProductPhotoGallery />
      <MistInOperation />
      <SmartControlTeaser />
      <HomeMagazineSections />
      <CooperationSteps />
      <HomeInquiryForm />
      <MobileStickyBar />
    </MotionConfig>
  );
}