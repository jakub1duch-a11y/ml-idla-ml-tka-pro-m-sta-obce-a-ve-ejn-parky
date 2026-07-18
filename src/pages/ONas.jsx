import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import CompanyTimeline from '@/components/about/CompanyTimeline';
import AboutDetails from '@/components/about/AboutDetails';

const IMAGES = {
  hero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/971f8ee29_generated_image.png',
  workshop: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/973b75ede_generated_image.png',
  team: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4037a1762_generated_image.png',
  installation: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/971f8ee29_generated_image.png',
};

export default function ONas() {
  useEffect(() => { setSEO(SEO_PAGES.oNas); }, []);
  return <main className="bg-white pt-[72px]"><AboutHero image={IMAGES.hero} /><AboutStory images={[IMAGES.workshop, IMAGES.team]} /><CompanyTimeline /><AboutDetails images={[IMAGES.team, IMAGES.workshop, IMAGES.installation]} /></main>;
}