import React from 'react';
import TechnologyGraphic from './TechnologyGraphic';
import SmartGardenSection from '@/components/smart-ovladani/SmartGardenSection';

export default function PdSmartControl({ product = null }) {
  return <>
    <SmartGardenSection product={product} eyebrow="SUPLA / volitelné chytré řízení" />
    <section className="bg-[#f7faf7] px-5 py-12 sm:px-8 sm:py-16" aria-label="Technické řešení instalace">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        <div><h3 className="mb-4 text-xl font-bold text-[#0D2D38]">Skryté kotvení</h3><TechnologyGraphic kind="anchoring" /></div>
        <div><h3 className="mb-4 text-xl font-bold text-[#0D2D38]">Umístění rozvodového boxu</h3><TechnologyGraphic kind="box" /></div>
      </div>
    </section>
  </>;
}
