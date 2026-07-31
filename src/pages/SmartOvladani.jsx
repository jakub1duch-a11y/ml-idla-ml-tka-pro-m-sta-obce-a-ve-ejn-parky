import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SmartHero from '@/components/smart-ovladani/SmartHero';
import SmartBenefits from '@/components/smart-ovladani/SmartBenefits';
import SmartSensorsSection from '@/components/smart-ovladani/SmartSensorsSection';
import SmartCTA from '@/components/smart-ovladani/SmartCTA';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';

export default function SmartOvladani() {
  useEffect(() => {
    setSEO({
      title: 'Smart ovládání mlžítek — aplikace a automatizace | mlzidla.cz',
      description: 'Chytrá aplikace pro ovládání mlžítek. Automatizace podle počasí, teploty, vlhkosti a pohybu. Vzdálené ovládání, scénáře a statistiky spotřeby.',
      keywords: 'smart ovládání mlžítek, aplikace mlžení, automatizace mlžení, chytré senzory mlžítka',
      canonicalPath: '/smart-ovladani',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SmartHero />
      <SmartBenefits />
      <SmartSensorsSection />
      <section className="bg-primary px-6 py-16 lg:px-10 lg:py-24"><div className="mx-auto max-w-5xl"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Smart úspory</p><h2 className="mt-4 font-heading text-4xl text-primary-foreground lg:text-5xl">Zjistěte, kolik ušetří chytré mlžení.</h2><p className="mt-4 max-w-2xl text-primary-foreground/70">Propojte provozní parametry s automatizací podle teploty a využití prostoru.</p><div className="mt-10"><MlzeniKalkulator /></div></div></section>
      <SmartCTA />
    </div>);

}