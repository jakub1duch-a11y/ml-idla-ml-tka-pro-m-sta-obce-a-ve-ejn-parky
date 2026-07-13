import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets } from 'lucide-react';

// Orientační výpočet při tlaku 4 bar, průtok ~60 l/h, provoz 8 h/den
const PERIODS = [
  { key: 'day', label: 'Den', water: '480 l', cost: '43 Kč' },
  { key: 'month', label: 'Měsíc', water: '14 400 l', cost: '1 296 Kč' },
  { key: 'season', label: 'Sezóna', water: '57 600 l', cost: '5 184 Kč' },
];

export default function WaterCostWidget() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % PERIODS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const period = PERIODS[active];

  return (
    <div className="inline-flex flex-col gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Droplets size={13} />
        <span className="text-[10px] font-mono tracking-widest uppercase">Spotřeba a cena při 4 bar</span>
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
    </div>
  );
}