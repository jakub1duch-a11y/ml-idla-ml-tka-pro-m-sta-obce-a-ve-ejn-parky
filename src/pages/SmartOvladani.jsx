import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SmartHero from '@/components/smart-ovladani/SmartHero';
import SmartHowItWorks from '@/components/smart-ovladani/SmartHowItWorks';
import SmartBenefits from '@/components/smart-ovladani/SmartBenefits';
import SmartSensorsSection from '@/components/smart-ovladani/SmartSensorsSection';
import SmartControlOffer from '@/components/smart-ovladani/SmartControlOffer';
import SmartCTA from '@/components/smart-ovladani/SmartCTA';

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
      <SmartHowItWorks />
      <SmartBenefits />
      <SmartSensorsSection />
      <SmartControlOffer />
      <SmartCTA />
    </div>);

}