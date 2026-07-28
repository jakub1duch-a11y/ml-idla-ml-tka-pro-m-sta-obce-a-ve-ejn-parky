import React from 'react';
import { motion } from 'framer-motion';

const BENEFITS = [
  'Ochlazení okolního vzduchu až o 9 °C bez pocitu mokra',
  'Mikro-kapky 5–10 μm se odpaří dřív, než dopadnou na zem',
  'Nerezová ocel AISI 316L — bez koroze, celoroční provoz',
  'Volitelné Wi-Fi Smart řízení, senzory a časovače',
];

export default function BenefitsSlide() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-8 lg:px-20 py-24 bg-ink">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-mono text-xs tracking-widest uppercase text-white/40 mb-4">[Benefity a instalace]</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-mono font-bold uppercase text-white mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Proč zvolit toto řešení
      </motion.h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="border border-white/15">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="px-4 py-3.5 border-b border-white/10 last:border-b-0 text-sm text-white/70">— {b}</motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="border border-white/15">
          <div className="px-4 py-2.5 border-b border-white/15">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">Kotvení a instalace</span>
          </div>
          <p className="px-4 py-4 text-sm text-white/60 leading-relaxed">
            Skryté kotvící patky, chemické kotvy do betonu. Rozměry a napojení na vodní řad upravitelné dle projektové dokumentace. Instalaci provádí certifikovaný technik HolmTec.
          </p>
        </motion.div>
      </div>
    </section>
  );
}