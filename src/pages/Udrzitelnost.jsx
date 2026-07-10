import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SustainabilityHero from '@/components/udrzitelnost/SustainabilityHero';
import SustainabilityStats from '@/components/udrzitelnost/SustainabilityStats';
import SustainabilityBenefits from '@/components/udrzitelnost/SustainabilityBenefits';
import SustainabilityCTA from '@/components/udrzitelnost/SustainabilityCTA';

export default function Udrzitelnost() {
  useEffect(() => {
    setSEO({
      title: 'Udržitelnost mlžení — úspora vody a městské klima | mlzidla.cz',
      description: 'Jak mlžení pomáhá životnímu prostředí — úspora vody, ochlazení tepelných ostrovů ve městech a podpora mikroklimatu bez chemikálií a freonů.',
      keywords: 'udržitelnost mlžení, úspora vody, městské klima, tepelné ostrovy, adiabatické chlazení',
      canonicalPath: '/udrzitelnost',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SustainabilityHero />
      <SustainabilityStats />
      <SustainabilityBenefits />
      <SustainabilityCTA />
    </div>);

}