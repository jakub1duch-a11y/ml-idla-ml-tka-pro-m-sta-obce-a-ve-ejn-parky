import React from 'react';
import { motion } from 'framer-motion';

export default function SpecsTab({ product, techRows }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Technické specifikace</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            Materiál a parametry<br /><span className="text-slate-400">v přesných číslech.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Nerezová ocel AISI 316L / 1.4301, přímé napojení na vodovod (2–7 BAR) — kompletní technický přehled produktu {product.name}.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            {techRows.map((row, i) => (
              <div key={row.label} className={`flex items-center justify-between gap-6 px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{row.label}</span>
                <span className="text-sm text-slate-900 font-medium text-right">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-6 px-6 py-4 bg-slate-50">
              <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Provozní tlak</span>
              <span className="text-sm text-slate-900 font-medium text-right">2–7 BAR (nízkotlaký)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}