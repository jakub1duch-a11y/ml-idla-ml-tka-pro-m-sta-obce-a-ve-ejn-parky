import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import MlzidlaHero from '@/components/mlzidla/MlzidlaHero';
import MlzidlaInfoBoxes from '@/components/mlzidla/MlzidlaInfoBoxes';
import MlzidlaDryMistTech from '@/components/mlzidla/MlzidlaDryMistTech';
import MlzidlaCatalog from '@/components/mlzidla/MlzidlaCatalog';
import MlzidlaInstallation from '@/components/mlzidla/MlzidlaInstallation';
import MlzidlaSmartSystem from '@/components/mlzidla/MlzidlaSmartSystem';
import MlzidlaRealizace from '@/components/mlzidla/MlzidlaRealizace';
import MlzidlaFooter from '@/components/mlzidla/MlzidlaFooter';

export default function Mlzidla() {
  useEffect(() => {
    setSEO({
      title: 'Mlžítka a mlžné sochy | HolmTec',
      description: 'Nerezové mlžné instalace pro městské prostory — mlžné sochy, brány, linie a mobilní mlžítka. Suchá mlha, smart řízení, CNC výroba.',
    });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <MlzidlaHero />
      <MlzidlaInfoBoxes />
      <MlzidlaDryMistTech />
      <MlzidlaCatalog />
      <MlzidlaInstallation />
      <MlzidlaSmartSystem />
      <MlzidlaRealizace />
      <MlzidlaFooter />
    </div>
  );
}