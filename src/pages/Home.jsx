import React, { useEffect } from 'react';
import { SEO_PAGES, setSEO } from '@/lib/seo';
import HeroSlider from '@/components/home/premium/HeroSlider';
import PremiumServicesSection from '@/components/home/premium/PremiumServicesSection';
import PremiumOasisSection from '@/components/home/premium/PremiumOasisSection';
import UrbanCoolingImpact from '@/components/home/premium/UrbanCoolingImpact';
import SmartSection from '@/components/home/SmartSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ReferenceSection from '@/components/home/ReferenceSection';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import BlogSection from '@/components/home/BlogSection';
import ContactSection from '@/components/home/ContactSection';
import ConceptToRealitySection from '@/components/home/ConceptToRealitySection';
import MistVideoShowcase from '@/components/common/MistVideoShowcase';
import FadeIn from '@/components/common/FadeIn';
import AIProjectDesignerSection from '@/components/home/AIProjectDesignerSection';
import HomepageVideoLoops from '@/components/home/HomepageVideoLoops';

export default function Home() {
  useEffect(() => {
    setSEO(SEO_PAGES.home);
  }, []);

  return (
    <>
      <HeroSlider />

      {/* Hlavní YouTube video – veřejně publikované na kanálu @mlzidla. */}
      <FadeIn>
        <section className="bg-slate-950 py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mb-6 max-w-3xl sm:mb-8">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-300">MLŽIDLA® · VIDEO</p>
              <h2 className="mt-3 font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-white sm:text-4xl lg:text-5xl">
                Mlžítka HolmTec v reálném provozu.
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/LrUH5z8OYQc?rel=0&modestbranding=1"
                  title="Mlžítka HolmTec v reálném provozu"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn><HomepageVideoLoops /></FadeIn>
      <FadeIn><PremiumServicesSection /></FadeIn>
      <FadeIn><PremiumOasisSection /></FadeIn>
      <FadeIn><UrbanCoolingImpact /></FadeIn>
      <FadeIn><SmartSection /></FadeIn>
      <FadeIn><FeaturedProductsSection /></FadeIn>
      <FadeIn><MistVideoShowcase /></FadeIn>
      <AIProjectDesignerSection />
      <FadeIn><InstagramFeedSection /></FadeIn>
      <FadeIn><BlogSection /></FadeIn>
      <FadeIn><ContactSection /></FadeIn>
      <FadeIn><ConceptToRealitySection /></FadeIn>
      <FadeIn><ReferenceSection /></FadeIn>
    </>
  );
}