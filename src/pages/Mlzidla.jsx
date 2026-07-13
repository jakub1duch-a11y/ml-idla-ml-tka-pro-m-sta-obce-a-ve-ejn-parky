import React, { useState, useEffect } from 'react';
import { Loader, Droplet } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { base44 } from '@/api/base44Client';
import MlzidlaCzNav from '@/components/mlzidlacz/MlzidlaCzNav';
import MlzidlaCzSidebar from '@/components/mlzidlacz/MlzidlaCzSidebar';
import MlzidlaCzShowcase from '@/components/mlzidlacz/MlzidlaCzShowcase';
import MlzidlaCzSpecsSidebar from '@/components/mlzidlacz/MlzidlaCzSpecsSidebar';
import MlzidlaCzFeatureRow from '@/components/mlzidlacz/MlzidlaCzFeatureRow';
import MlzidlaCzTechDetails from '@/components/mlzidlacz/MlzidlaCzTechDetails';

export default function Mlzidla() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setSEO({
      title: 'Mlžidla.cz — Mlžné systémy',
      description: 'Interaktivní mlžné sochy, brány, linie a mobilní mlžítka z nerezové oceli. Ochlazení veřejných prostorů, parků, hřišť a zoo.',
    });
  }, []);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list().catch(() => []),
      base44.entities.ProductCategory.list().catch(() => []),
    ]).then(([prods, cats]) => {
      const enriched = (prods || []).map((p) => ({
        ...p,
        id: p.id,
        name: p.name,
        short: (cats || []).find((c) => c.id === p.category_id)?.name || '',
        category: (cats || []).find((c) => c.id === p.category_id)?.name || 'Mlžný systém',
        description: p.short_description || p.description || '',
        description2: p.description && p.description !== p.short_description ? p.description : '',
        image: p.image_url,
        icon: Droplet,
      }));
      setProducts(enriched);
      if (enriched.length > 0) setActiveId(enriched[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const activeIndex = products.findIndex((p) => p.id === activeId);
  const activeProduct = products[activeIndex];

  const goPrev = () => setActiveId(products[(activeIndex - 1 + products.length) % products.length].id);
  const goNext = () => setActiveId(products[(activeIndex + 1) % products.length].id);

  return (
    <div className="min-h-screen bg-slate-50">
      <MlzidlaCzNav />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 space-y-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader size={24} className="animate-spin text-slate-300" />
          </div>
        ) : !activeProduct ? (
          <p className="text-center text-slate-400 py-24 text-sm">Žádné produkty k zobrazení.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-6 items-stretch">
              <MlzidlaCzSidebar products={products} activeId={activeId} onSelect={setActiveId} />
              <MlzidlaCzShowcase product={activeProduct} onPrev={goPrev} onNext={goNext} />
              <MlzidlaCzSpecsSidebar />
            </div>

            <MlzidlaCzFeatureRow />
            <MlzidlaCzTechDetails />
          </>
        )}
      </div>
    </div>
  );
}