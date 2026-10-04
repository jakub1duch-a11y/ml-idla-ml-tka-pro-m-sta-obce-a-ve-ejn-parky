import React, { useEffect } from 'react';
<<<<<<< HEAD
import { SEO_PAGES, setSEO } from '@/lib/seo';
import B2gHero from '@/components/home/b2g/B2gHero';
import AudienceFitSection from '@/components/home/b2g/AudienceFitSection';
import CityGatesSection from '@/components/home/b2g/CityGatesSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import SmartSection from '@/components/home/SmartSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import MistVideoShowcase from '@/components/common/MistVideoShowcase';
import FadeIn from '@/components/common/FadeIn';
=======
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
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
>>>>>>> 1e28a04f7e4fc88c3c1a6e05f0c05012801eeb4e

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
<<<<<<< HEAD
    <>
      <B2gHero />
      <FadeIn><AudienceFitSection /></FadeIn>
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><CityGatesSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><ReferenceSection /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><MistVideoShowcase /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
    </>
=======
    <MotionConfig reducedMotion="user">
      <HomeGsapMotion />
      <HomeHero />
      <UrbanCoolingExperience />
      <PremiumHomepage2026 />
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
>>>>>>> 1e28a04f7e4fc88c3c1a6e05f0c05012801eeb4e
  );
}