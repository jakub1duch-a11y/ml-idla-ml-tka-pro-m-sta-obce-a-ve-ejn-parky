import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Layers, Cpu, ThermometerSnowflake, Gauge } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';
import SmartSystemPreview from '@/components/katalog/SmartSystemPreview';
import FeatureIconRow from '@/components/common/FeatureIconRow';

const CATALOG_FEATURES = [
{ icon: Droplets, label: 'Nízká spotřeba vody', value: 'od 4,6 l/h' },
{ icon: ThermometerSnowflake, label: 'Ochlazení okolí', value: 'až −9 °C' },
{ icon: Gauge, label: 'Nízkotlaký provoz', value: '2–8 bar (200–800 kPa)' },
{ icon: Cpu, label: 'Smart řízení', value: 'volitelné moduly' }];

const TABS = [
{ id: 'mlzitka', label: 'Mlžítka', icon: Droplets },
{ id: 'prislusenstvi', label: 'Příslušenství a moduly', icon: Layers },
{ id: 'smart', label: 'Smart systém', icon: Cpu }];


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
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="content-eyebrow mb-3">Katalog 2026</p>
          <h1 className="content-title mb-3">Mlžítka, příslušenství a Smart systém.</h1>
          <p className="content-lead max-w-2xl">Přehled řešení pro příjemnější venkovní prostor — od mlžných bran po chytré řízení.</p>
        </motion.div>

        <FeatureIconRow items={CATALOG_FEATURES} className="mb-10" />

        {/* Desktop tab bar */}
        <div className="hidden lg:flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {TABS.map((t) =>
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${tab === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t.label}
            </button>
          )}
        </div>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-28 lg:pb-0">
        {tab === 'mlzitka' && <ProductFilterGrid />}
        {tab === 'prislusenstvi' && <AccessoriesSection />}
        {tab === 'smart' && <SmartSystemPreview />}
      </motion.div>

      {/* Mobile switcher — thumb-reachable, fixed at bottom, one-handed use */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-md">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-900/10">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-full text-[11px] font-medium transition-colors ${active ? 'text-white' : 'text-slate-500'}`}>
                {active &&
                <motion.div layoutId="katalog-mobile-tab" className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                }
                <Icon size={16} />
                <span className="leading-tight px-1 text-center">{t.label.split(' ')[0]}</span>
              </button>);

          })}
        </div>
      </div>
    </div>);

}