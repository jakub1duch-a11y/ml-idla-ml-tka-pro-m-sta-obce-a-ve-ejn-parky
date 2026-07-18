import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import CompanyTimeline from '@/components/about/CompanyTimeline';
import AboutDetails from '@/components/about/AboutDetails';

const IMAGES = {
  hero: [
    'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/97adcdb67_file_000000001abc8243a41e16d7f22e87b8.png',
    'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/57deff22f_file_00000000d4088243bd7e7756f3f578ee.png',
    'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/56c7177f9_file_00000000d3e4820a9f8ddf44e75fd576.png',
    'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1edebf945_file_000000000bcc820a8ba5306228a3186c.png',
  ],
  workshop: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1dd60f1b8_image-20260416-133342-657.jpg',
  team: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/90dbd90b5_98030134-2893482690773264-8607596107406508032-n.jpg',
  installation: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/199af122a_Screenshot_20260718_034719.jpg',
};

export default function ONas() {
  useEffect(() => { setSEO(SEO_PAGES.oNas); }, []);
  return <main className="bg-white pt-[72px]"><AboutHero images={IMAGES.hero} /><AboutStory images={[IMAGES.workshop, IMAGES.team]} /><CompanyTimeline /><AboutDetails images={[IMAGES.team, IMAGES.workshop, IMAGES.installation]} /></main>;
}