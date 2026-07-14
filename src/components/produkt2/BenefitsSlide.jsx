import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BENEFITS = [
  'Ochlazení okolního vzduchu až o 9 °C bez pocitu mokra',
  'Mikro-kapky 5–10 μm se odpaří dřív, než dopadnou na zem',
  'Nerezová ocel AISI 316L — bez koroze, celoroční provoz',
  'Volitelné Wi-Fi Smart řízení, senzory a časovače',
];

export default function BenefitsSlide() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 py-24 bg-white">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold tracking-wide text-techblue mb-4">Benefity a instalace</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-heading font-light text-slate-900 mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Proč zvolit toto řešení
      </motion.h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 px-5 py-4 border-b border-slate-100 last:border-b-0 text-sm text-slate-600">
              <Check size={16} className="text-techblue shrink-0 mt-0.5" /> {b}
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kotvení a instalace</span>
          </div>
          <p className="px-5 py-5 text-sm text-slate-600 leading-relaxed">
            Skryté kotvící patky, chemické kotvy do betonu. Rozměry a napojení na vodní řad upravitelné dle projektové dokumentace. Instalaci provádí certifikovaný technik HolmTec.
          </p>
        </motion.div>
      </div>
    </section>
  );
}