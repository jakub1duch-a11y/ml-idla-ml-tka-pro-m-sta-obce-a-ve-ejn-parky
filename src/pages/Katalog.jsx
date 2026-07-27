import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Droplets, Layers, Cpu, ThermometerSnowflake, Gauge, CalendarDays } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import ProductFilterGrid from '@/components/chytra/ProductFilterGrid';
import AccessoriesSection from '@/components/chytra/AccessoriesSection';
import FeatureIconRow from '@/components/common/FeatureIconRow';
import CatalogRentalCard from '@/components/katalog/CatalogRentalCard';

const CATALOG_FEATURES = [
{ icon: Droplets, label: 'Nízká spotřeba vody', value: 'od 4,6 l/h' },
{ icon: ThermometerSnowflake, label: 'Ochlazení okolí', value: 'až −9 °C' },
{ icon: Gauge, label: 'Nízkotlaký provoz', value: '2–8 bar (200–800 kPa)' },
{ icon: Cpu, label: 'Smart řízení', value: 'volitelné moduly' }];

const TABS = [
{ id: 'brany', label: 'Mlžné brány a portály', icon: Droplets },
{ id: 'mlzitka', label: 'Designová mlžítka', icon: Layers },
{ id: 'prislusenstvi', label: 'Příslušenství a Smart', icon: Cpu },
{ id: 'pronajem', label: 'Pronájem', icon: CalendarDays }];


export default function Katalog() {
  const location = useLocation();
  const [tab, setTab] = useState(() => {
    const section = new URLSearchParams(window.location.search).get('sekce');
    return ['brany', 'mlzitka', 'prislusenstvi', 'pronajem'].includes(section) ? section : 'brany';
  });

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('sekce');
    if (['brany', 'mlzitka', 'prislusenstvi', 'pronajem'].includes(section)) setTab(section);
  }, [location.search]);

  useEffect(() => {
    setSEO({
      title: 'Katalog — mlžítka, příslušenství a Smart systém | mlzidla.cz',
      description: 'Kompletní katalog mlžítek, příslušenství a modulů a přehled Smart systému pro chytré řízení mlžení.',
      keywords: 'katalog mlžítek, příslušenství mlžítek, smart systém mlžidla',
      canonicalPath: '/katalog'
    });
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="content-eyebrow mb-3 mt-12">KATALOG 2026</p>
          <h1 className="mb-2 text-[hsl(var(--ring))] text-3xl mt-4">Mlžítka, příslušenství a Smart systém.</h1>
          <p className="content-lead text-justify text-base pb-4 max-w-2x1">Přehled řešení pro příjemnější venkovní prostor — od mlžných bran po chytré řízení.</p>
        </motion.div>

        <FeatureIconRow items={CATALOG_FEATURES} className="mb-10" />

        <nav aria-label="Kategorie katalogu" className="sticky top-16 z-20 overflow-x-auto border-y px-3 py-3 backdrop-blur-xl -mx-2 border-slate-500">
          <div className="flex min-w-max gap-2">{TABS.map((t) => {const Icon = t.icon;const active = tab === t.id;return <button key={t.id} onClick={() => setTab(t.id)} className={`relative inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Icon size={17} />{t.label}{active && <span className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full text-[hsl(var(--background))] bg-[hsl(var(--foreground))] my-1" />}</button>;})}</div>
        </nav>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-28 lg:pb-5">
        {tab === 'brany' && <ProductFilterGrid mode="gates" />}
        {tab === 'mlzitka' && <ProductFilterGrid mode="sculptures" />}
        {tab === 'prislusenstvi' && <AccessoriesSection />}
        {tab === 'pronajem' && <CatalogRentalCard />}
      </motion.div>
    </div>);

}