import React, { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import DetailPhotoStory from '@/components/motion/DetailPhotoStory';
import HomeHero from '@/components/home/new/HomeHero';
import ReferencesStrip from '@/components/home/new/ReferencesStrip';
import V3EditorialBridge from '@/components/home/new/V3EditorialBridge';
import HomeMagazineSections from '@/components/home/new/HomeMagazineSections';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import ProductPhotoGallery from '@/components/home/new/ProductPhotoGallery';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import FinancingSection from '@/components/home/new/FinancingSection';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import HomeMist3DScene from '@/components/home/new/HomeMist3DScene';
import HomeGsapMotion from '@/components/home/new/HomeGsapMotion';
import PremiumHomepage2026 from '@/components/home/new/PremiumHomepage2026';
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
        <UrbanCoolingExperience />
        <PremiumHomepage2026 />
        <DetailPhotoStory />
        <HomeMist3DScene />
        <ProductPhotoGallery />
        <V3EditorialBridge />
        <HomeMagazineSections />
        <ReferencesStrip />
        <ProKohoSection />
        <MistInOperation />
        <CooperationSteps />
        <FinancingSection />
        <HomeInquiryForm />
        <MobileStickyBar />
      </MotionConfig>
    </div>
  );
}
