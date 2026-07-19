import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Droplets } from 'lucide-react';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';
import { setSEO } from '@/lib/seo';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CalculatorContextLinks from '@/components/kalkulacka/CalculatorContextLinks';
import B2BReferencesSection from '@/components/reference/B2BReferencesSection';

export default function Kalkulacka() {
  useEffect(() => {
    setSEO({
      title: 'Spočítat provozní náklady mlžítek a mlžných bran | HolmTec',
      description: 'Spočítejte spotřebu vody a orientační náklady včetně stočného podle počtu trysek při tlaku 4 bar za 8 hodin, týden a letní sezónu.',
      canonicalPath: '/kalkulacka'
    });
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Kalkulačka provozních nákladů' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs font-mono tracking-widest uppercase mb-3 flex items-center justify-center gap-2 text-slate-400"><Calculator size={16} /> KALKULÁTOR</p>
          <h1 className="font-heading font-light text-3xl lg:text-4xl tracking-tight mb-3 text-slate-900">Spočítat provozní náklady</h1>
          <p className="text-sm max-w-2xl mx-auto text-slate-500">Vyberte model mlžítka nebo mlžné brány GATE a počet trysek. Výsledek ukazuje spotřebu vody a cenu včetně stočného při tlaku 4 bar.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <MlzeniKalkulator />
        </motion.div>
        <CalculatorContextLinks />
      </div>
      <div className="mt-16"><B2BReferencesSection context="mesta-obce" title="Provozní náklady v kontextu skutečných městských realizací." /></div>
    </div>);

}