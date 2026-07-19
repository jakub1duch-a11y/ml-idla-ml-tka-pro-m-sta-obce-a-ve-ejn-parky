import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import TechHero from '@/components/technologie/TechHero';
import TechEvaporation from '@/components/technologie/TechEvaporation';
import TechConstruction from '@/components/technologie/TechConstruction';
import TechSmartControl from '@/components/technologie/TechSmartControl';
import TechSystemComparison from '@/components/technologie/TechSystemComparison';
import TechInstallation from '@/components/technologie/TechInstallation';
import TechLinks from '@/components/technologie/TechLinks';

export default function Technologie() {
  useEffect(() => { setSEO({ title: 'Jak fungují mlžidla a mlžítka | HolmTec', description: 'Princip odpařování kapek 50–100 μm, nerezová konstrukce, mikrotrysky a chytré řízení mlžných systémů HolmTec.', keywords: 'jak funguje mlžítko, kapky 50–100 μm, technologie mlžení, mikrotrysky, chytré řízení mlžení', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7d93243ca_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png', canonicalPath: '/jak-funguje-mlzeni' }); }, []);
  return <main className="min-h-screen bg-white"><TechHero /><TechEvaporation /><TechConstruction /><TechSmartControl /><TechSystemComparison /><TechInstallation /><TechLinks /></main>;
}