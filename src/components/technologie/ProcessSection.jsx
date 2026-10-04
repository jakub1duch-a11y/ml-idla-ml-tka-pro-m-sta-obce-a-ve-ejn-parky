import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, PenTool, Factory, HardHat } from 'lucide-react';

const STEPS = [
  { icon: Cloud, num: '1', title: 'Koncept a inspirace', text: 'Konzultace ideálního tvaru — od organických motivů (páv, mrak) po lokální symboly. Zdarma.' },
  { icon: PenTool, num: '2', title: 'CAD a technická podpora', text: 'Precizní integrace do projektové dokumentace a ověření vyrobitelnosti s architekty.' },
  { icon: Factory, num: '3', title: 'Zakázková výroba', text: 'Využití kapacit a 22 let zkušeností dceřiné společnosti Ohýbací centrum HolmTec.' },
  { icon: HardHat, num: '4', title: 'Rychlá instalace', text: 'Profesionální montáž s ohledem na maximální bezpečnost a estetiku.' },
];

export default function ProcessSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 border-t border-slate-100">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-3xl">
        <h2 className="mb-2 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Zhmotňujeme vaši vizi.</h2>
        <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">Od CAD návrhu k realitě</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <span className="absolute top-4 right-5 text-3xl font-heading font-light text-slate-200">{s.num}</span>
            <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
              <s.icon size={19} className="text-slate-700" />
            </div>
            <h3 className="text-slate-900 font-medium text-base mb-2">{s.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}