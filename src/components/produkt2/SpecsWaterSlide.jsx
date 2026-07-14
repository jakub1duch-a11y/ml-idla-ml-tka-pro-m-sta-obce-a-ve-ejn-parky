import React from 'react';
import { motion } from 'framer-motion';
import SpecTable from '@/components/produkt2/SpecTable';
import WaterConsumptionCalculator from '@/components/produkt2/WaterConsumptionCalculator';

export default function SpecsWaterSlide({ specRows, defaultNozzles }) {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 py-24 bg-slate-50">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold tracking-wide text-techblue mb-4">Technické parametry</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-heading font-light text-slate-900 mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Parametry a spotřeba vody
      </motion.h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <SpecTable title="Systémové parametry" rows={specRows} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <WaterConsumptionCalculator defaultNozzles={defaultNozzles} />
        </motion.div>
      </div>
    </section>
  );
}