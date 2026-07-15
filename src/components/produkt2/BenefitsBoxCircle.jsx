import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BENEFITS = [
  'Ochlazení okolního vzduchu až o 9 °C bez pocitu mokra',
  'Mikro-kapky 5–10 μm se odpaří dřív, než dopadnou na zem',
  'Nerezová ocel AISI 316L — bez koroze, celoroční provoz',
  'Volitelné Wi-Fi Smart řízení, senzory a časovače',
];

export default function BenefitsBoxCircle() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 py-24 bg-white overflow-hidden">
      {/* decorative rings */}
      <div className="absolute -right-52 top-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-slate-100 pointer-events-none" />
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-slate-200 pointer-events-none" />

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative text-sm font-semibold tracking-wide text-techblue mb-4">Benefity a instalace</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative font-heading font-light text-slate-900 mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Proč zvolit toto řešení
      </motion.h2>

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_auto] gap-10 max-w-5xl items-center">
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 px-5 py-4 border-b border-slate-100 last:border-b-0 text-sm text-slate-600">
              <Check size={16} className="text-techblue shrink-0 mt-0.5" /> {b}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="w-52 h-52 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mx-auto">
          <div className="text-center text-white">
            <p className="text-4xl font-heading font-light">9 °C</p>
            <p className="text-xs text-white/60 mt-1">Ochlazení vzduchu</p>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative mt-8 max-w-5xl w-full rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kotvení a instalace</span>
        </div>
        <p className="px-5 py-5 text-sm text-slate-600 leading-relaxed">
          Skryté kotvící patky, chemické kotvy do betonu. Rozměry a napojení na vodní řad upravitelné dle projektové dokumentace. Instalaci provádí certifikovaný technik HolmTec.
        </p>
      </motion.div>
    </section>
  );
}