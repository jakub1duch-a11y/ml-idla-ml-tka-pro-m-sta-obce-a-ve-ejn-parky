import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Segmented } from 'konsta/react';
import KolekceHero from '@/components/kolekce/KolekceHero';
import { Droplets, Layers, Cpu, ThermometerSnowflake, Gauge } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';
import SmartSystemPreview from '@/components/katalog/SmartSystemPreview';
import FeatureIconRow from '@/components/common/FeatureIconRow';

const CATALOG_FEATURES = [
{ icon: Droplets, label: 'Nízká spotřeba vody', value: 'od 4,6 l/h' },
{ icon: ThermometerSnowflake, label: 'Ochlazení okolí', value: 'až −9 °C' },
{ icon: Gauge, label: 'Nízkotlaký provoz', value: '2–7 BAR' },
{ icon: Cpu, label: 'Smart řízení', value: 'volitelné moduly' }];

const TABS = [
{ id: 'mlzitka', label: 'Mlžítka', icon: Droplets },
{ id: 'prislusenstvi', label: 'Příslušenství a moduly', icon: Layers },
{ id: 'smart', label: 'Smart systém', icon: Cpu }];


export default function Katalog() {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState('mlzitka');

  useEffect(() => {
    setSEO({
      title: 'Katalog — mlžítka, příslušenství a Smart systém | mlzidla.cz',
      description: 'Kompletní katalog mlžítek, příslušenství a modulů a přehled Smart systému pro chytré řízení mlžení.',
      keywords: 'katalog mlžítek, příslušenství mlžítek, smart systém mlžidla',
      canonicalPath: '/mlzidla-mlzitka',
    });
  }, []);

  return (
    <div className="catalog-premium min-h-screen overflow-x-clip bg-white">
      <KolekceHero />
      <div id="catalog" className="catalog-pattern hero-gallery-anchor relative mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-10 lg:pt-20">
        

        <FeatureIconRow items={CATALOG_FEATURES} className="mb-10" />

        {/* Desktop tab bar */}
        <div className="hidden lg:flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {TABS.map((t) =>
          <motion.button key={t.id} onClick={() => setTab(t.id)} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: 0.97 }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${tab === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t.label}
            </motion.button>
          )}
        </div>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-28 lg:pb-0">
        {tab === 'mlzitka' && <ProductFilterGrid />}
        {tab === 'prislusenstvi' && <AccessoriesSection />}
        {tab === 'smart' && <SmartSystemPreview />}
      </motion.div>

      {/* Mobile switcher — Konsta touch-first segmented control */}
      <div className="lg:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-md">
        <div className="rounded-[22px] border border-slate-200/80 bg-white/85 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <Segmented strong>
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  aria-pressed={active}
                  onClick={() => setTab(t.id)}
                  className={`flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-[16px] px-2 text-[11px] font-semibold transition-colors ${active ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600'}`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="leading-tight">{t.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </Segmented>
        </div>
      </div>
    </div>);

}