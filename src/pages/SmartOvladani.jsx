import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SmartHero from '@/components/smart-ovladani/SmartHero';
import SmartBenefits from '@/components/smart-ovladani/SmartBenefits';
import SmartSensorsSection from '@/components/smart-ovladani/SmartSensorsSection';
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
      <SmartBenefits />
      <SmartSensorsSection />
      <SmartCTA />
    </div>);

}