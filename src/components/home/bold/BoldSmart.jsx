import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone } from 'lucide-react';
import SmartSensorGrid from '@/components/home/smart/SmartSensorGrid';
import SmartAutomationList from '@/components/home/smart/SmartAutomationList';
import SmartControlPicker from '@/components/home/smart/SmartControlPicker';

export default function BoldSmart() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white border-t-2 border-black">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs font-black tracking-widest uppercase mb-5">
            <Smartphone size={13} /> Smart Wi-Fi ovládání
          </span>
          <h2 className="font-heading font-black uppercase text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            Mlžení, které <span className="text-red-600">samo ví, kdy zapnout.</span>
          </h2>
          <p className="text-slate-500 text-base lg:text-lg leading-relaxed">
            Senzory teploty, vlhkosti, větru a pohybu předávají data do aplikace, která mlžení automaticky spouští, upravuje i vypíná.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-l border-black mb-10 lg:mb-12">
          <div className="p-5 border-r border-b border-black">
            <p className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3">Senzory v reálném čase</p>
            <SmartSensorGrid />
          </div>
          <div className="p-5 border-r border-b border-black">
            <p className="text-xs font-black tracking-widest uppercase text-slate-400 mb-3">Automatizace</p>
            <SmartAutomationList />
          </div>
          <div className="p-5 border-r border-b border-black bg-black flex flex-col justify-between">
            <SmartControlPicker />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-sm text-slate-500 max-w-md">Podrobný přehled senzorů, automatizačních scénářů a nabídky Smart Wi-Fi systémů najdete na detailní stránce.</p>
          <Link to="/chytra-mlzidla" className="inline-flex items-center gap-2 px-7 py-4 bg-black text-white text-sm font-black uppercase tracking-wide hover:bg-red-600 transition-colors whitespace-nowrap">
            Chytré ovládání <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}