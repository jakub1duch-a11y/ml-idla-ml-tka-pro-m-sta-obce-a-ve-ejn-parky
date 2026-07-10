import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';
import SmartSystemPreview from '@/components/katalog/SmartSystemPreview';

const TABS = [
{ id: 'mlzitka', label: 'Mlžítka' },
{ id: 'prislusenstvi', label: 'Příslušenství a moduly' },
{ id: 'smart', label: 'Smart systém' }];


export default function Katalog() {
  const [tab, setTab] = useState('mlzitka');

  useEffect(() => {
    setSEO({
      title: 'Katalog — mlžítka, příslušenství a Smart systém | mlzidla.cz',
      description: 'Kompletní katalog mlžítek, příslušenství a modulů a přehled Smart systému pro chytré řízení mlžení.',
      keywords: 'katalog mlžítek, příslušenství mlžítek, smart systém mlžidla',
      canonicalPath: '/katalog',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Katalog 2026</p>
        <h1 className="font-heading font-medium text-3xl lg:text-5xl text-slate-900 tracking-tight mb-8">Mlžítka, příslušenství a Smart systém.</h1>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {TABS.map((t) =>
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${tab === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t.label}
            </button>
          )}
        </div>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {tab === 'mlzitka' && <ProductFilterGrid />}
        {tab === 'prislusenstvi' && <AccessoriesSection />}
        {tab === 'smart' && <SmartSystemPreview />}
      </motion.div>
    </div>);

}