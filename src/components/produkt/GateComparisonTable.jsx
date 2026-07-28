import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Circle, Square, ArrowRight, PlayCircle, Building2, Shapes, Component, Layers, Droplets, Gauge, Ruler, Zap } from 'lucide-react';

const COLUMNS = [
  {
    id: 'gate-u',
    name: 'GATE70-U',
    tag: 'Rovná varianta',
    detailLink: '/gate70',
    demoLink: '/gate70#video',
  },
  {
    id: 'gate-v',
    name: 'GATE70-V',
    tag: 'Lomený oblouk',
    detailLink: '/gate70',
    demoLink: '/gate70#video',
  },
  {
    id: 'linea',
    name: 'LINEA CE70',
    tag: 'Obloukový design',
    detailLink: '/produkt/linea-el70',
    demoLink: '/produkt/linea-el70?tab=video',
  },
];

const CONSTRUCTION = [
  {
    icon: Circle,
    title: 'GATE70 — kulatá trubka',
    desc: 'Konstrukce svařovaná z kulatých nerezových trubek TR76×3 mm (AISI 316L) — čistý, minimalistický profil vhodný pro rovné i obloukové tvary bez viditelných spojů.',
  },
  {
    icon: Square,
    title: 'LINEA CE70 — jeklový profil',
    desc: 'Konstrukce z uzavřeného hranatého (jeklového) nerezového profilu AISI 316L, leštěného do vysokého lesku — dodává obloukovému designu ostřejší, architektonický výraz.',
  },
];

const ROWS = [
  { label: 'Design / tvar', icon: Shapes, gateU: 'Rovný, pravoúhlý tvar', gateV: 'Lomený organický oblouk', linea: 'Plynulý obloukový design' },
  { label: 'Konstrukční profil', icon: Component, gateU: 'Kulatá trubka Ø76 mm', gateV: 'Kulatá trubka Ø76 mm', linea: 'Hranatý (jeklový) profil' },
  { label: 'Materiál', icon: Layers, gateU: 'AISI 316L, broušený/kartáčovaný', gateV: 'AISI 316L, broušený/kartáčovaný', linea: 'AISI 316L, leštěný nerez' },
  { label: 'Spotřeba vody', icon: Droplets, gateU: '15–25 l/h', gateV: '15–25 l/h', linea: '≈ 30 l/h (0,5 l/min)' },
  { label: 'Tlak mlžení', icon: Gauge, gateU: '3–7 bar', gateV: '3–7 bar', linea: '4–7 bar' },
  { label: 'Rozměry', icon: Ruler, gateU: '2 × 2,2 m (upravitelné)', gateV: '2 × 2,2 m (upravitelné)', linea: 'Výška 0,7 m (upravitelné)' },
  { label: 'Napájení / řízení', icon: Zap, gateU: '12 V, Wi-Fi Smart, senzory', gateV: '12 V, Wi-Fi Smart, senzory', linea: 'Vodovodní řad, volitelně Wi-Fi + LED' },
];

const COLUMN_KEYS = ['gateU', 'gateV', 'linea'];

export default function GateComparisonTable() {
  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles size={12} /> Nerezová konstrukce AISI 316L
          </span>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-3">
            GATE70 vs. LINEA CE70 — <span className="italic text-slate-400">hlavní rozdíl je v konstrukci.</span>
          </h2>
          <p className="text-slate-500 text-sm font-light max-w-2xl leading-relaxed">
            Obě řady jsou z prémiové nerezové oceli AISI 316L, odolné korozi po celý rok. Zásadní rozdíl je v profilu konstrukce — GATE70 je svařován z kulaté trubky, LINEA CE70 z uzavřeného hranatého (jeklového) profilu.
          </p>
        </motion.div>

        {/* Construction material callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {CONSTRUCTION.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
                <c.icon size={18} className="text-slate-900" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">{c.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick-view / live demo per model */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {COLUMNS.map((col, i) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col">
              <span className="text-sm font-bold text-slate-900">{col.name}</span>
              <span className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-4">{col.tag}</span>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link to={col.detailLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all">
                  Zobrazit detail <ArrowRight size={12} />
                </Link>
                <Link to={col.demoLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-all">
                  <PlayCircle size={13} /> Živá ukázka
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison table — desktop */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="hidden lg:block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-10">
          <div className="grid grid-cols-4 bg-gradient-to-r from-slate-900 to-slate-700">
            <div className="px-4 py-4">
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Parametr</span>
            </div>
            {COLUMNS.map((col) => (
              <div key={col.id} className="px-4 py-4 border-l border-white/10">
                <span className="text-sm font-bold text-white tracking-tight">{col.name}</span>
              </div>
            ))}
          </div>

          {ROWS.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
              <div className="px-4 py-4 flex items-center gap-2">
                <row.icon size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{row.label}</span>
              </div>
              {COLUMN_KEYS.map((key) => {
                const differs = row[key] !== row.gateU;
                return (
                  <div key={key} className={`px-4 py-4 border-l border-slate-100 flex items-center ${differs ? 'bg-sky-50/60' : ''}`}>
                    <span className={`text-sm font-medium leading-snug ${differs ? 'text-sky-700' : 'text-slate-900'}`}>{row[key]}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* Comparison — mobile stacked cards */}
        <div className="lg:hidden space-y-4 mb-10">
          {COLUMNS.map((col, ci) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.06 }}
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-700 flex items-baseline gap-2">
                <span className="text-sm font-bold text-white tracking-tight">{col.name}</span>
                <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">{col.tag}</span>
              </div>
              {ROWS.map((row, i) => {
                const key = COLUMN_KEYS[ci];
                const differs = row[key] !== row.gateU;
                return (
                  <div key={row.label} className={`flex items-start gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${differs ? 'border-l-2 border-sky-400' : ''}`}>
                    <row.icon size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-0.5">{row.label}</p>
                      <p className={`text-sm font-medium leading-snug ${differs ? 'text-sky-700' : 'text-slate-900'}`}>{row[key]}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Urban / parks offer callout */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">Nabídka pro městské prostory a parky</p>
              <p className="text-xs text-white/50 leading-relaxed max-w-md">Obě brány jsou navrženy pro náměstí, parky, vjezdy i veřejné instalace — připravíme vám nezávaznou nabídku na míru vašeho projektu.</p>
            </div>
          </div>
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all whitespace-nowrap">
            Nezávazná nabídka <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}