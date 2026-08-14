import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SmartHero from '@/components/smart-ovladani/SmartHero';
import SmartBenefits from '@/components/smart-ovladani/SmartBenefits';
import SmartSensorsSection from '@/components/smart-ovladani/SmartSensorsSection';
import SmartAutomationFlow from '@/components/smart-ovladani/SmartAutomationFlow';
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
      <SmartAutomationFlow />
      <SmartBenefits />
      <SmartSensorsSection />
      <section className="bg-primary py-20 lg:py-24"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Smart úspory</p><h2 className="mt-4 max-w-3xl font-heading text-3xl leading-[1.08] tracking-[-.02em] text-primary-foreground sm:text-4xl lg:text-5xl">Zjistěte, kolik může chytré řízení ušetřit.</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">Propojte skutečné provozní parametry s automatizací podle teploty, počasí a využití prostoru.</p><div className="mt-10"><MlzeniKalkulator /></div></div></section>
      <SmartCTA />
    </div>);

}