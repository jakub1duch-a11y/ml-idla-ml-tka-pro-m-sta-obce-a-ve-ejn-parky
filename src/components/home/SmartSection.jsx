import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone } from 'lucide-react';
import SmartSensorGrid from '@/components/home/smart/SmartSensorGrid';
import SmartAutomationList from '@/components/home/smart/SmartAutomationList';
import SmartControlPicker from '@/components/home/smart/SmartControlPicker';

export default function SmartSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Decorative glow */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono tracking-widest uppercase mb-5">
            <Smartphone size={13} /> Smart Wi-Fi ovládání
          </span>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight mb-5">
            Mlžení, které <span className="italic text-cyan-300">samo ví, kdy zapnout.</span>
          </h2>
          <p className="text-white/60 text-base lg:text-lg leading-relaxed">
            Senzory teploty, vlhkosti, větru a pohybu předávají data do aplikace, která mlžení automaticky spouští, upravuje i vypíná — bez zásahu obsluhy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-12">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Senzory v reálném čase</p>
            <SmartSensorGrid />
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Automatizace</p>
            <SmartAutomationList />
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
            <SmartControlPicker />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8 border-t border-white/10">
          <p className="text-sm text-white/50 max-w-md">Podrobný přehled senzorů, automatizačních scénářů a nabídky Smart Wi-Fi systémů najdete na detailní stránce.</p>
          <Link to="/smart-ovladani" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all whitespace-nowrap">
            Zjistit více o Smart řízení <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}