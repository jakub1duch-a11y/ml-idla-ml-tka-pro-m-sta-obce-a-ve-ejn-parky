import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES, injectOrgJsonLd } from '@/lib/seo';
import MinimalHero from '@/components/home/minimal/MinimalHero';
import MinimalQuickNav from '@/components/home/minimal/MinimalQuickNav';
import MinimalServices from '@/components/home/minimal/MinimalServices';
import MinimalOasis from '@/components/home/minimal/MinimalOasis';
import MinimalSmart from '@/components/home/minimal/MinimalSmart';
import MinimalProducts from '@/components/home/minimal/MinimalProducts';
import MinimalInstagram from '@/components/home/minimal/MinimalInstagram';
import MinimalBlog from '@/components/home/minimal/MinimalBlog';
import MinimalContact from '@/components/home/minimal/MinimalContact';
import MinimalGallery from '@/components/home/minimal/MinimalGallery';
import FadeIn from '@/components/common/FadeIn';

export default function Home3() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
    injectOrgJsonLd();
  }, []);
  return (
    <>
      <MinimalHero />
      <MinimalQuickNav />
      <FadeIn><MinimalServices /></FadeIn>
      <FadeIn><MinimalOasis /></FadeIn>
      <FadeIn><MinimalSmart /></FadeIn>
      <FadeIn><MinimalProducts /></FadeIn>
      <FadeIn><MinimalInstagram /></FadeIn>
      <FadeIn><MinimalBlog /></FadeIn>
      <FadeIn><MinimalContact /></FadeIn>
      <FadeIn><MinimalGallery /></FadeIn>
    </>
  );
}