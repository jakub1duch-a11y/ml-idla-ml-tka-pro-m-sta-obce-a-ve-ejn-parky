import React, { useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import SustainabilityHero from '@/components/udrzitelnost/SustainabilityHero';
import SustainabilityStats from '@/components/udrzitelnost/SustainabilityStats';
import SustainabilityBenefits from '@/components/udrzitelnost/SustainabilityBenefits';
import SustainabilityCTA from '@/components/udrzitelnost/SustainabilityCTA';
import ContextLinks from '@/components/common/ContextLinks';

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
      <ContextLinks eyebrow="Související témata" title="Udržitelnost dává smysl v kontextu celého provozu." items={[
        { path: '/mestske-mlzitka', kicker: 'Produkty', title: 'Městská mlžítka', text: 'Řešení pro veřejný prostor s důrazem na životnost, servis a provoz.' },
        { path: '/vyhody', kicker: 'Přínosy', title: 'Výhody a benefity', text: 'Komfort, správa, materiály a dlouhodobá hodnota dobře navrženého systému.' },
        { path: '/smart-ovladani', kicker: 'Efektivita', title: 'Chytré ovládání', text: 'Automatizace pomáhá omezit zbytečný provoz a lépe řídit spotřebu vody.' },
        { path: '/ochrana-zdravi', kicker: 'Hygiena', title: 'Ochrana zdraví', text: 'Praktické informace o kvalitě vody, proplachu, údržbě a správě veřejných instalací.' },
        { path: '/jak-to-funguje', kicker: 'Princip', title: 'Jak mlžítka fungují', text: 'Technický princip evaporačního chlazení a souvislosti návrhu systému.' },
        { path: '/reference', kicker: 'Realizace', title: 'Reference', text: 'Podívejte se, jak jsou řešení začleněná do reálných městských a veřejných prostor.' }
      ]} />
      <SustainabilityCTA />
    </div>);

}