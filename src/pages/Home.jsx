import React, { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import TopGateHeroSlider from '@/components/home/new/TopGateHeroSlider';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import HomeGsapMotion from '@/components/home/new/HomeGsapMotion';
import '@/styles/reference-motion.css';
import '@/styles/home-clean-layout.css';

// Sekce pod hero se načítají až po prvním vykreslení → rychlejší první zobrazení.
const HomeOverview = lazy(() => import('@/components/home/new/HomeEditorialSections').then(m => ({ default: m.HomeOverview })));
const HomeTechnology = lazy(() => import('@/components/home/new/HomeEditorialSections').then(m => ({ default: m.HomeTechnology })));
const HomeHolmTec = lazy(() => import('@/components/home/new/HomeEditorialSections').then(m => ({ default: m.HomeHolmTec })));
const ProductPhotoGallery = lazy(() => import('@/components/home/new/ProductPhotoGallery'));
const ReferencesStrip = lazy(() => import('@/components/home/new/ReferencesStrip'));
const CooperationSteps = lazy(() => import('@/components/home/new/CooperationSteps'));
const HomeInquiryForm = lazy(() => import('@/components/home/new/HomeInquiryForm'));

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
    <div className="home-atmosphere home-clean">
      <MotionConfig reducedMotion="user">
        <HomeGsapMotion />
        <TopGateHeroSlider />
        <Suspense fallback={<div className="min-h-[60vh] bg-[#07131D]" />}>
          <HomeOverview />
          <ProductPhotoGallery />
          <HomeTechnology />
          <ReferencesStrip />
          <HomeHolmTec />
          <CooperationSteps />
          <HomeInquiryForm />
        </Suspense>
        <MobileStickyBar />
      </MotionConfig>
    </div>
  );
}