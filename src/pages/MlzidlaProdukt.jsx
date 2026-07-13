import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MlzidlaProduktBreadcrumb from '@/components/mlzidlacz/MlzidlaProduktBreadcrumb';
import MlzidlaProduktGallery from '@/components/mlzidlacz/MlzidlaProduktGallery';
import MlzidlaProduktInfo from '@/components/mlzidlacz/MlzidlaProduktInfo';
import MlzidlaProduktQuickSpecs from '@/components/mlzidlacz/MlzidlaProduktQuickSpecs';
import MlzidlaProduktTabs from '@/components/mlzidlacz/MlzidlaProduktTabs';
import MlzidlaProduktRealizace from '@/components/mlzidlacz/MlzidlaProduktRealizace';
import MlzidlaProduktCTA from '@/components/mlzidlacz/MlzidlaProduktCTA';
import { PRODUCTS } from '@/components/mlzidlacz/mlzidlaCzData';

export default function MlzidlaProdukt() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  useEffect(() => {
    setSEO({
      title: `${product.name} — Mlžidla.cz`,
      description: product.description,
    });
  }, [product]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 pt-24 space-y-6">
        <MlzidlaProduktBreadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <MlzidlaProduktGallery product={product} />
          <MlzidlaProduktInfo product={product} />
        </div>

        <MlzidlaProduktQuickSpecs product={product} />
        <MlzidlaProduktTabs product={product} />
        <MlzidlaProduktRealizace product={product} />
        <MlzidlaProduktCTA />

        <div className="text-center pb-4">
          <Link to="/mlzidla" className="text-xs text-slate-400 hover:text-slate-700 transition-colors">← Zpět na všechny produkty</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}