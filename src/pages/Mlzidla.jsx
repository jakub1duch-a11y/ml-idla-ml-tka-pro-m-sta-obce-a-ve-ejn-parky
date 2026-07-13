import React, { useState, useEffect } from 'react';
import { setSEO } from '@/lib/seo';
import MlzidlaCzNav from '@/components/mlzidlacz/MlzidlaCzNav';
import MlzidlaCzSidebar from '@/components/mlzidlacz/MlzidlaCzSidebar';
import MlzidlaCzShowcase from '@/components/mlzidlacz/MlzidlaCzShowcase';
import MlzidlaCzSpecsSidebar from '@/components/mlzidlacz/MlzidlaCzSpecsSidebar';
import MlzidlaCzFeatureRow from '@/components/mlzidlacz/MlzidlaCzFeatureRow';
import MlzidlaCzTechDetails from '@/components/mlzidlacz/MlzidlaCzTechDetails';
import { PRODUCTS } from '@/components/mlzidlacz/mlzidlaCzData';

export default function Mlzidla() {
  const [activeId, setActiveId] = useState(PRODUCTS[0].id);

  useEffect(() => {
    setSEO({
      title: 'Mlžidla.cz — Mlžné systémy',
      description: 'Interaktivní mlžné sochy, brány, linie a mobilní mlžítka z nerezové oceli. Ochlazení veřejných prostorů, parků, hřišť a zoo.',
    });
  }, []);

  const activeIndex = PRODUCTS.findIndex((p) => p.id === activeId);
  const activeProduct = PRODUCTS[activeIndex];

  const goPrev = () => setActiveId(PRODUCTS[(activeIndex - 1 + PRODUCTS.length) % PRODUCTS.length].id);
  const goNext = () => setActiveId(PRODUCTS[(activeIndex + 1) % PRODUCTS.length].id);

  return (
    <div className="min-h-screen bg-slate-50">
      <MlzidlaCzNav />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-6 items-stretch">
          <MlzidlaCzSidebar products={PRODUCTS} activeId={activeId} onSelect={setActiveId} />
          <MlzidlaCzShowcase product={activeProduct} onPrev={goPrev} onNext={goNext} />
          <MlzidlaCzSpecsSidebar />
        </div>

        <MlzidlaCzFeatureRow />
        <MlzidlaCzTechDetails />
      </div>
    </div>
  );
}