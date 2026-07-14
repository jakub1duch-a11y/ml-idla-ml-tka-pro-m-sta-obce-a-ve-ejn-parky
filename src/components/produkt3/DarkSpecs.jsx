import React from 'react';
import { motion } from 'framer-motion';

export default function DarkSpecs({ rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <section id="specifikace" className="min-h-screen w-full bg-black flex flex-col justify-center px-6 lg:px-16 py-20">
      <div className="max-w-3xl mx-auto w-full">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold text-techblue mb-4">Technická data</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-heading font-bold text-white tracking-tight mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          Specifikace
        </motion.h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {rows.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-6 py-4 border-b border-white/10 last:border-b-0">
              <span className="text-sm text-white/50">{r.label}</span>
              <span className="text-sm font-medium text-white text-right">{r.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}