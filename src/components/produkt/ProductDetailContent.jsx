import React from 'react';
import OProduktuTab from '@/components/produkt/tabs/OProduktuTab';
import BenefityTab from '@/components/produkt/tabs/BenefityTab';
import SpecsTab from '@/components/produkt/tabs/SpecsTab';
import InstallationTab from '@/components/produkt/tabs/InstallationTab';
import ZivaUkazkaTab from '@/components/produkt/tabs/ZivaUkazkaTab';
import DownloadsTab from '@/components/produkt/tabs/DownloadsTab';
import GateComparisonTable from '@/components/produkt/GateComparisonTable';
import NozzleVariantsTable from '@/components/produkt/NozzleVariantsTable';
import NozzleMaintenanceTab from '@/components/produkt/tabs/NozzleMaintenanceTab';

const GATE_SLUGS = ['gate70', 'linea-el70'];

export default function ProductDetailContent({ product, techRows, allImages, isAccessory, onOpenLightbox }) {
  return (
    <>
      {!isAccessory && <section id="benefity"><BenefityTab product={product} /></section>}
      <section id="parametry">
        <SpecsTab product={product} techRows={techRows} />
        {GATE_SLUGS.includes(product.slug) && <GateComparisonTable />}
        {isAccessory && <NozzleVariantsTable variants={product.nozzle_variants} />}
      </section>
      {isAccessory && <NozzleMaintenanceTab product={product} />}
      <section id="o-produktu"><OProduktuTab product={product} /></section>
      <section id="ukazka"><ZivaUkazkaTab product={product} allImages={allImages} onOpenLightbox={onOpenLightbox} /></section>
      {!isAccessory && <section id="instalace"><InstallationTab product={product} /></section>}
      <section id="dokumentace"><DownloadsTab product={product} /></section>
    </>
  );
}