import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Droplets } from 'lucide-react';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';
import { setSEO } from '@/lib/seo';

export default function Kalkulacka() {
  useEffect(() => {
    setSEO({
      title: 'Kalkulátor provozních nákladů mlžítek a mlžných bran | HolmTec',
      description: 'Spočítejte si orientační spotřebu vody a měsíční provozní náklady aktivních mlžítek a mlžných bran MLŽIDLA.cz.'
    });
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs font-mono tracking-widest uppercase mb-3 flex items-center justify-center gap-2 text-slate-400">KALKULÁTOR</p>
          <h1 className="font-heading font-light text-3xl lg:text-4xl tracking-tight mb-3 text-slate-900">Provozní náklady mlžítek a mlžných bran</h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed text-slate-500">Vyberte konkrétní mlžítko a nastavte předpokládanou dobu provozu. Kalkulačka zobrazí orientační spotřebu vody a měsíční náklady podle parametrů našich aktivních produktů.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <MlzeniKalkulator />
        </motion.div>
      </div>
    </div>);

}