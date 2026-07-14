import React from 'react';
import { motion } from 'framer-motion';
import { Radar, Cpu, Droplets, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: Radar, title: '1. Senzory sbírají data', desc: 'Teplota, vlhkost, vítr a pohyb v okolí mlžítka se měří v reálném čase.' },
  { icon: Cpu, title: '2. Aplikace vyhodnotí podmínky', desc: 'HolmTec aplikace porovná data se scénářem, který jste nastavili.' },
  { icon: Droplets, title: '3. Mlžení se spustí samo', desc: 'Systém zapne, upraví nebo vypne mlžení bez zásahu obsluhy.' },
];

export default function SmartHowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Jak Smart systém funguje</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Od senzoru k mlžení ve třech krocích.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4 items-stretch">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.title}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex-1">
                <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                  <s.icon size={18} className="text-cyan" />
                </div>
                <h3 className="text-slate-900 font-medium mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>
              {i < STEPS.length - 1 &&
              <div className="hidden sm:flex items-center justify-center">
                <ArrowRight size={18} className="text-slate-300" />
              </div>
              }
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>);

}