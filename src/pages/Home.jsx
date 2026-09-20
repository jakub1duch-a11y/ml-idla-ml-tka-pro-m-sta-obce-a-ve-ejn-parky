import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import HomeHero from '@/components/home/new/HomeHero';
import ProKohoSection from '@/components/home/new/ProKohoSection';
import MistInOperation from '@/components/home/new/MistInOperation';
import SmartControlTeaser from '@/components/home/new/SmartControlTeaser';
import FeaturedMlzitka from '@/components/home/new/FeaturedMlzitka';
import CooperationSteps from '@/components/home/new/CooperationSteps';
import ReferenceCards from '@/components/home/new/ReferenceCards';
import FinancingSection from '@/components/home/new/FinancingSection';
import HomeInquiryForm from '@/components/home/new/HomeInquiryForm';
import MobileStickyBar from '@/components/home/new/MobileStickyBar';

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
      <motion.section aria-labelledby="city-network" className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <motion.div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.8, 0.55] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <div>
            <motion.p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Pro města a obce</motion.p>
            <h2 id="city-network" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">Městská síť ochlazovacích míst. Od prvního pilotu po celé území.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">Spojíme návrh zón, modulární produkty, pilotní sezónu, servis a možnost rozšíření do jednoho srozumitelného řešení. Mlha zůstává tam, kde má: v prostoru, ne na zemi.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/poptavka" className="group rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">Navrhnout síť ochlazovacích míst <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span></a>
              <a href="/kontakt" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Popsat konkrétní prostor</a>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {['Zónový návrh podle prostoru a provozu','Modulární mlžítka a mlžné brány','Pilotní sezóna + servis','Postupné rozšíření bez změny konceptu'].map((item, index) => (
              <motion.div key={item} whileHover={{ x: 5 }} className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm transition-colors hover:border-cyan-300/30 hover:bg-white/[0.09]">
                <span className="font-mono text-xs font-semibold text-cyan-300">0{index + 1}</span>
                <p className="mt-2 font-medium">{item}</p>
                <span className="mt-3 block h-px w-8 bg-cyan-300/40 transition-all duration-300 group-hover:w-16" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      <ProKohoSection />
      <MistInOperation />
      <SmartControlTeaser />
      <FeaturedMlzitka />
      <CooperationSteps />
      <ReferenceCards />
      <FinancingSection />
      <HomeInquiryForm />
      <MobileStickyBar />
    </>
  );
}