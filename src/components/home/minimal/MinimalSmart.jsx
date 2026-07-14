import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone } from 'lucide-react';
import SmartSensorGrid from '@/components/home/smart/SmartSensorGrid';
import SmartAutomationList from '@/components/home/smart/SmartAutomationList';
import SmartControlPicker from '@/components/home/smart/SmartControlPicker';

export default function MinimalSmart() {
  return (
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium tracking-widest uppercase mb-5">
            <Smartphone size={13} /> Smart Wi-Fi ovládání
          </span>
          <h2 className="font-heading font-extralight text-3xl lg:text-4xl text-slate-900 tracking-tight mb-5">
            Mlžení, které samo ví, kdy zapnout.
          </h2>
          <p className="text-slate-500 text-base lg:text-lg leading-relaxed">
            Senzory teploty, vlhkosti, větru a pohybu předávají data do aplikace, která mlžení automaticky spouští, upravuje i vypíná.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          <div className="p-6 rounded-[1.75rem] bg-slate-50">
            <p className="text-xs tracking-widest uppercase text-slate-400 mb-3">Senzory v reálném čase</p>
            <SmartSensorGrid />
          </div>
          <div className="p-6 rounded-[1.75rem] bg-slate-50">
            <p className="text-xs tracking-widest uppercase text-slate-400 mb-3">Automatizace</p>
            <SmartAutomationList />
          </div>
          <div className="p-6 rounded-[1.75rem] bg-slate-900 flex flex-col justify-between">
            <SmartControlPicker />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-sm text-slate-500 max-w-md">Podrobný přehled senzorů, automatizačních scénářů a nabídky Smart Wi-Fi systémů najdete na detailní stránce.</p>
          <Link to="/chytra-mlzidla" className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors whitespace-nowrap">
            Chytré ovládání <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}