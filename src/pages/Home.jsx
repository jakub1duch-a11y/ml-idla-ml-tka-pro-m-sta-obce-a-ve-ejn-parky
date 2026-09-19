import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import ReferencesStrip from '@/components/home/new/ReferencesStrip';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import SmartControlTeaser from '@/components/home/new/SmartControlTeaser';
import FeaturedMlzitka from '@/components/home/new/FeaturedMlzitka';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import ReferenceCards from '@/components/home/new/ReferenceCards';
import FinancingSection from '@/components/home/new/FinancingSection';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';
import HiggsfieldCityPromo from '@/components/home/HiggsfieldCityPromo';

export default function Home() {
  useEffect(() => {
    setSEO({
      title: 'Městské ochlazování | Mlžidla.cz – výroba, pronájem, servis',
      description: 'Navrhneme městské ochlazování od první zóny po celou síť ochlazovacích míst. Modulární mlžítka, mlžné brány a mlhoviště z nerezu AISI 316L, Smart řízení a servis.',
      keywords: 'městské ochlazování, ochlazovací místa, mlžítka pro města, mlžné brány, mlhoviště, městský tepelný ostrov, Smart mlžení, AISI 316L',
      canonicalPath: '/',
      robots: 'index, follow',
    });
  }, []);

  return (
    <>
      <HomeHero />
      <ReferencesStrip />
      <section aria-labelledby="city-network" className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Pro města a obce</p>
            <h2 id="city-network" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">Městská síť ochlazovacích míst. Od prvního pilotu po celé území.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">Spojíme návrh zón, modulární produkty, pilotní sezónu, servis a možnost rozšíření do jednoho srozumitelného řešení. Mlha zůstává tam, kde má: v prostoru, ne na zemi.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/mestske-ochlazovani" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">Navrhnout síť ochlazovacích míst</a>
              <a href="/poptavka" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Popsat konkrétní prostor</a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {['Zónový návrh podle prostoru a provozu','Modulární mlžítka a mlžné brány','Pilotní sezóna + servis','Postupné rozšíření bez změny konceptu'].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <span className="text-xs font-semibold text-cyan-300">0{index + 1}</span>
                <p className="mt-2 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProKohoSection />
      <MistInOperation />
      <SmartControlTeaser />
      <HiggsfieldCityPromo />
      <FeaturedMlzitka />
      <CooperationSteps />
      <ReferenceCards />
      <FinancingSection />
      <HomeInquiryForm />
      <MobileStickyBar />
    </>
  );
}