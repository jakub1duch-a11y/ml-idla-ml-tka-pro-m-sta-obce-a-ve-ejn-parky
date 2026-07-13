import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Settings, Factory, HardHat } from 'lucide-react';

const STEPS = [
  { num: '1', title: 'Koncept a inspirace', color: 'bg-teal-500', icon: Compass, text: <>Konzultace ideálního tvaru — od organických motivů (páv, mrak) po lokální symboly. <span className="font-bold text-slate-900">ZDARMA.</span></> },
  { num: '2', title: 'CAD a technická podpora', color: 'bg-emerald-500', icon: Settings, text: 'Precizní integrace do projektové dokumentace a ověření vyrobitelnosti s architekty.' },
  { num: '3', title: 'Zakázková výroba', color: 'bg-teal-500', icon: Factory, text: 'Využití kapacit a 22 let zkušeností dceřiné společnosti Ohýbací centrum HolmTec.' },
  { num: '4', title: 'Rychlá instalace', color: 'bg-emerald-500', icon: HardHat, text: 'Profesionální montáž s ohledem na maximální bezpečnost a estetiku.' },
];

// Elbow drop points (x = card center %, level = 'low' | 'high') matching the reference zig-zag
const JOINTS = [
  { x: 12.5, level: 'low' },
  { x: 37.5, level: 'high' },
  { x: 62.5, level: 'low' },
  { x: 87.5, level: 'high' },
];

export default function ConceptToRealitySection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24 lg:mb-28">
          <h2 className="font-heading font-bold text-3xl lg:text-5xl text-slate-900 tracking-tight mb-3">Zhmotňujeme vaši vizi.</h2>
          <p className="text-slate-500 text-lg">Od CAD návrhu k realitě</p>
        </motion.div>

        <div className="relative pt-16 md:pt-20">
          {/* Brushed steel pipe graphic connecting the cards */}
          <svg viewBox="0 0 1000 160" preserveAspectRatio="none" className="absolute -top-2 left-0 w-full h-[170px] hidden md:block pointer-events-none">
            <defs>
              <linearGradient id="pipeGradHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="18%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#94a3b8" />
                <stop offset="58%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <path
              d="M -30 40 L 105 40 L 105 110 L 355 110 L 355 40 L 605 40 L 605 110 L 855 110 L 855 40 L 1030 40"
              fill="none" stroke="url(#pipeGradHome)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M -30 34 L 105 34 L 105 104 L 355 104 L 355 34 L 605 34 L 605 104 L 855 104 L 855 34 L 1030 34"
              fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            />
            {[105, 355, 605, 855].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy={i % 2 === 0 ? 110 : 40} r="16" fill="#475569" />
                <circle cx={x} cy={i % 2 === 0 ? 110 : 40} r="16" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                <line x1={x - 8} y1={i % 2 === 0 ? 110 : 40} x2={x + 8} y2={i % 2 === 0 ? 110 : 40} stroke="#1e293b" strokeWidth="1.5" />
                <line x1={x} y1={(i % 2 === 0 ? 110 : 40) - 8} x2={x} y2={(i % 2 === 0 ? 110 : 40) + 8} stroke="#1e293b" strokeWidth="1.5" />
              </g>
            ))}
          </svg>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 ${JOINTS[i].level === 'low' ? 'md:mt-10' : ''}`}>
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