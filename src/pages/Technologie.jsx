import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import TechHero from '@/components/technologie/TechHero';
import TechEvaporation from '@/components/technologie/TechEvaporation';
import TechConstruction from '@/components/technologie/TechConstruction';
import TechSmartControl from '@/components/technologie/TechSmartControl';
import TechInstallation from '@/components/technologie/TechInstallation';
import TechLinks from '@/components/technologie/TechLinks';

export default function Technologie() {
  useEffect(() => { setSEO({ title: 'Jak fungují mlžidla a mlžítka | HolmTec', description: 'Princip mlžení, nerezová konstrukce, mikrotrysky, chytré řízení a možnosti instalace mlžných systémů HolmTec.', keywords: 'jak funguje mlžítko, technologie mlžení, mlžidla, mikrotrysky, chytré řízení mlžení', canonicalPath: '/technologie' }); }, []);
  return <main className="min-h-screen bg-white"><TechHero /><TechEvaporation /><TechConstruction /><TechSmartControl /><TechInstallation /><TechLinks /></main>;
}