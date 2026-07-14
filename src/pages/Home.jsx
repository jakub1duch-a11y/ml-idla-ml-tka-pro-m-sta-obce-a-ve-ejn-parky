import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import BoldHero from '@/components/home/bold/BoldHero';
import BoldQuickNav from '@/components/home/bold/BoldQuickNav';
import BoldServices from '@/components/home/bold/BoldServices';
import BoldOasis from '@/components/home/bold/BoldOasis';
import BoldSmart from '@/components/home/bold/BoldSmart';
import BoldProducts from '@/components/home/bold/BoldProducts';
import BoldInstagram from '@/components/home/bold/BoldInstagram';
import BoldBlog from '@/components/home/bold/BoldBlog';
import BoldContact from '@/components/home/bold/BoldContact';
import BoldGallery from '@/components/home/bold/BoldGallery';
import FadeIn from '@/components/common/FadeIn';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <BoldHero />
      <BoldQuickNav />
      <FadeIn><BoldServices /></FadeIn>
      <FadeIn><BoldOasis /></FadeIn>
      <FadeIn><BoldSmart /></FadeIn>
      <FadeIn><BoldProducts /></FadeIn>
      <FadeIn><BoldInstagram /></FadeIn>
      <FadeIn><BoldBlog /></FadeIn>
      <FadeIn><BoldContact /></FadeIn>
      <FadeIn><BoldGallery /></FadeIn>
    </>
  );
}