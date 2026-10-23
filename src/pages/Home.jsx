import React, { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import StudioProductStrip from '@/components/home/new/StudioProductStrip';
import ReferencesStrip from '@/components/home/new/ReferencesStrip';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import ProductPhotoGallery from '@/components/home/new/ProductPhotoGallery';
import HomeVideoReel from '@/components/home/new/HomeVideoReel';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import HomeGsapMotion from '@/components/home/new/HomeGsapMotion';
import UrbanCoolingExperience from '@/components/home/new/UrbanCoolingExperience';
import '@/styles/urban-cooling-experience.css';
import '@/styles/reference-motion.css';

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
        <StudioProductStrip />
        <UrbanCoolingExperience />
        <HomeVideoReel />
        <ProductPhotoGallery />
        <ReferencesStrip />
        <ProKohoSection />
        <CooperationSteps />
        <HomeInquiryForm />
        <MobileStickyBar />
      </MotionConfig>
    </div>
  );
}