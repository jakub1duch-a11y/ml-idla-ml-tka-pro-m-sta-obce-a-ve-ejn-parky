import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Settings, Factory, HardHat } from 'lucide-react';

const STEPS = [
  { num: '1', title: 'Koncept a inspirace', color: 'bg-teal-500', icon: Cloud, text: <>Konzultace ideálního tvaru — od organických motivů (páv, mrak) po lokální symboly. <span className="font-bold text-slate-900">ZDARMA.</span></> },
  { num: '2', title: 'CAD a technická podpora', color: 'bg-emerald-500', icon: Settings, text: 'Precizní integrace do projektové dokumentace a ověření vyrobitelnosti s architekty.' },
  { num: '3', title: 'Zakázková výroba', color: 'bg-teal-500', icon: Factory, text: 'Využití kapacit a 22 let zkušeností dceřiné společnosti Ohýbací centrum HolmTec.' },
  { num: '4', title: 'Rychlá instalace', color: 'bg-emerald-500', icon: HardHat, text: 'Profesionální montáž s ohledem na maximální bezpečnost a estetiku.' },
];

export default function ConceptToRealitySection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 lg:mb-20">
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-slate-900 tracking-tight mb-3">Zhmotňujeme vaši vizi.</h2>
          <p className="text-slate-500 text-lg">Od CAD návrhu k realitě</p>
        </motion.div>

        <div className="relative">
          {/* Brushed steel pipe graphic connecting the cards */}
          <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className="absolute -top-14 left-0 w-full h-[180px] hidden md:block pointer-events-none">
            <defs>
              <linearGradient id="pipeGradHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="42%" stopColor="#94a3b8" />
                <stop offset="55%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            <path
              d="M -30 70 L 130 70 L 130 150 L 380 150 L 380 70 L 630 70 L 630 150 L 880 150 L 880 70 L 1230 70"
              fill="none" stroke="url(#pipeGradHome)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"
            />
            {[130, 380, 630, 880].map((x) => (
              <circle key={x} cx={x} cy={x === 130 || x === 630 ? 150 : 70} r="14" fill="#475569" opacity="0.35" />
            ))}
          </svg>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className={`${s.color} px-4 py-3`}>
                  <p className="text-white font-bold text-sm leading-snug">{s.num}. {s.title}</p>
                </div>
                <div className="p-5">
                  <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                    <s.icon size={20} className="text-slate-700" />
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}