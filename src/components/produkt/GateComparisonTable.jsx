import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ROWS = [
  { label: 'Design / tvar', gate70: 'Rovný (-U) nebo lomený oblouk (-V)', linea: 'Zakřivený, obloukový design' },
  { label: 'Materiál', gate70: 'Nerezová ocel AISI 316L, TR76×3 svařované trubky', linea: 'Nerezová ocel AISI 316L, leštěný povrch' },
  { label: 'Povrchová úprava', gate70: 'Broušený / kartáčovaný', linea: 'Leštěný nerez — vysoký lesk' },
  { label: 'Spotřeba vody', gate70: '15–25 l/h', linea: '0,5 l/min (≈ 30 l/h)' },
  { label: 'Tlak mlžení', gate70: '3–7 bar', linea: '4–7 bar' },
  { label: 'Velikost trysek', gate70: '5–8 ks, 10–50 μm', linea: '10 μm' },
  { label: 'Rozměry', gate70: 'Šíře 2 m × výška 2,2 m (upravitelné)', linea: 'Výška 0,7 m (upravitelné)' },
  { label: 'Napájení / řízení', gate70: '12 V, Wi-Fi Smart, senzory teploty a pohybu', linea: 'Vodovodní řad, volitelně Wi-Fi + LED podsvícení' },
  { label: 'Doporučené využití', gate70: 'Vstupy, náměstí, parky, eventy', linea: 'Náměstí, bazény, obloukové vstupy' },
];

export default function GateComparisonTable() {
  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles size={12} /> Moderní nerezové provedení AISI 316L
          </span>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-3">
            GATE70 vs. LINEA CE70 — <span className="italic text-slate-400">srovnání bran.</span>
          </h2>
          <p className="text-slate-500 text-sm font-light max-w-2xl leading-relaxed">
            Obě mlžné brány jsou vyrobeny z prémiové nerezové oceli AISI 316L, odolné korozi a vhodné pro celoroční venkovní provoz. Liší se tvarem, spotřebou vody a doporučeným využitím.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-slate-900 to-slate-700">
            <div className="px-5 py-4">
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Parametr</span>
            </div>
            <div className="px-5 py-4 border-l border-white/10">
              <span className="text-sm font-bold text-white tracking-tight">GATE70</span>
            </div>
            <div className="px-5 py-4 border-l border-white/10">
              <span className="text-sm font-bold text-white tracking-tight">LINEA CE70</span>
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
              <div className="px-5 py-4 flex items-center">
                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{row.label}</span>
              </div>
              <div className="px-5 py-4 border-l border-slate-100 flex items-center">
                <span className="text-sm text-slate-900 font-medium leading-snug">{row.gate70}</span>
              </div>
              <div className="px-5 py-4 border-l border-slate-100 flex items-center">
                <span className="text-sm text-slate-900 font-medium leading-snug">{row.linea}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}