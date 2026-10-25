import React, { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import HomeGsapMotion from '@/components/home/new/HomeGsapMotion';
import '@/styles/urban-cooling-experience.css';
import '@/styles/reference-motion.css';

// Sekce pod hero se načítají až po prvním vykreslení → rychlejší první zobrazení.
const UrbanCoolingExperience = lazy(() => import('@/components/home/new/UrbanCoolingExperience'));
const ProductPhotoGallery = lazy(() => import('@/components/home/new/ProductPhotoGallery'));
const ReferencesStrip = lazy(() => import('@/components/home/new/ReferencesStrip'));
const ProKohoSection = lazy(() => import('@/components/home/new/ProKohoSection'));
const CooperationSteps = lazy(() => import('@/components/home/new/CooperationSteps'));
const HomeInquiryForm = lazy(() => import('@/components/home/new/HomeInquiryForm'));
const HomeNews = lazy(() => import('@/components/home/new/HomeNews'));

export default function Home() {
  useEffect(() => {
    setSEO({
      title: 'Mlžítka pro města, obce i zahrady | MLŽIDLA.cz',
      description: 'Nerezová mlžítka, mlžné brány a mlhoviště pro města, obce, parky i zahrady. Návrh, technické podklady a chytré řízení pro venkovní prostory.',
      keywords: 'mlžítka, mlžítka pro města, městská mlžítka, mlžítka pro obce, zahradní mlžítka, mlžné brány, mlhoviště, vodní mlha, ochlazování měst, mlžení veřejného prostoru',
      canonicalPath: '/',
      robots: 'index, follow',
    });
  }, []);

  return (
    <div className="home-atmosphere">
      <MotionConfig reducedMotion="user">
        <HomeGsapMotion />
        <HomeHero />
        <Suspense fallback={<div className="min-h-[60vh] bg-[#07131D]" />}>
          <UrbanCoolingExperience />
          <ProductPhotoGallery />
          <ReferencesStrip />
          <ProKohoSection />
          <CooperationSteps />
          <HomeInquiryForm />
          <HomeNews />
        </Suspense>
        <MobileStickyBar />
      </MotionConfig>
    </div>
  );
}