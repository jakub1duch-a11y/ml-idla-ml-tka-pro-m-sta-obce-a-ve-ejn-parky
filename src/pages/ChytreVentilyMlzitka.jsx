import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SmartMistingHero from '@/components/smart-misting/SmartMistingHero';
import SmartValveSection from '@/components/smart-misting/SmartValveSection';
import MistingMountingSection from '@/components/smart-misting/MistingMountingSection';
import SmartMistingCTA from '@/components/smart-misting/SmartMistingCTA';

export default function ChytreVentilyMlzitka() {
  useEffect(() => { setSEO({ title: 'Chytré ventily a samostatná mlžítka | mlzidla.cz', description: 'Samostatná nerezová mlžítka Ø 70 mm s kotvením na patku nebo zemní vrut a chytrým Wi-Fi ventilem.', canonicalPath: '/chytre-ventily-mlzitka' }); }, []);
  return <main className="min-h-screen bg-white"><SmartMistingHero /><SmartValveSection /><MistingMountingSection /><SmartMistingCTA /></main>;
}