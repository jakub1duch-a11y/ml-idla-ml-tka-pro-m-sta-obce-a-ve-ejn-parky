import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Info, Sparkles } from 'lucide-react';

// Orientační výpočet při tlaku 4 bar, průtok ~60 l/h (5 trysek × 12 l/h), provoz 8 h/den
const PERIODS = [
  { key: 'day', label: 'Den', water: '480 l', cost: '43 Kč', formula: '60 l/h × 8 h = 480 l. 480 l × 90 Kč/m³ ÷ 1000 = 43 Kč.' },
  { key: 'month', label: 'Měsíc', water: '14 400 l', cost: '1 296 Kč', formula: '480 l/den × 30 dní = 14 400 l. × 90 Kč/m³ ÷ 1000 = 1 296 Kč.' },
  { key: 'season', label: 'Sezóna', water: '57 600 l', cost: '5 184 Kč', formula: '480 l/den × 120 dní sezóny = 57 600 l. × 90 Kč/m³ ÷ 1000 = 5 184 Kč.' },
];
const SMART_APP_SAVINGS = 0.25;

export default function WaterCostWidget() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % PERIODS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const period = PERIODS[active];

  return (
    <div className="inline-flex flex-col gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm">
      <div className="group relative flex items-center gap-2 text-slate-400">
        <Droplets size={13} />
        <span className="text-[10px] font-mono tracking-widest uppercase">Spotřeba a cena při 4 bar</span>
        <Info size={11} className="text-slate-300 group-hover:text-slate-600 transition-colors cursor-help" />
        <div className="pointer-events-none absolute left-0 right-0 top-full mt-1.5 z-20 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl w-56">
            <p className="text-[10px] font-mono text-white/70 leading-relaxed">{period.formula}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {PERIODS.map((p, i) => (
          <button key={p.key} onClick={() => setActive(i)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all ${active === i ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={period.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
          className="flex items-center gap-5">
          <div>
            <p className="text-lg font-heading font-semibold text-slate-900">{period.water}</p>
            <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Vody / {period.label.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-lg font-heading font-semibold text-slate-900">{period.cost}</p>
            <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Orientační cena</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <Sparkles size={11} className="text-emerald-500" />
        <span className="text-[10px] font-mono text-emerald-600">Se Smart APP −{SMART_APP_SAVINGS * 100} % spotřeby</span>
      </div>
    </div>
  );
}