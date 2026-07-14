import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

function SpecRow({ row, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = row.icon || Info;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative px-6 py-4 cursor-default transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${hovered ? 'bg-slate-100' : ''}`}
    >
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-2.5 text-xs font-mono text-slate-400 tracking-widest uppercase">
          <motion.span
            animate={hovered ? { rotate: [0, -8, 8, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-slate-500"
          >
            <Icon size={14} />
          </motion.span>
          {row.label}
        </span>
        <span className="text-sm text-slate-900 font-medium text-right">{row.value}</span>
      </div>
      {/* Mobile: description always readable, no hover needed */}
      {row.desc && (
        <p className="sm:hidden text-xs text-slate-500 font-light leading-relaxed pr-4 mt-2">{row.desc}</p>
      )}
      {/* Desktop: reveal on hover */}
      <AnimatePresence>
        {hovered && row.desc && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:block text-xs text-slate-500 font-light leading-relaxed pr-4 overflow-hidden"
          >
            {row.desc}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

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
            Nerezová ocel AISI 316L / 1.4301, přímé napojení na vodovod (2–7 BAR) — popis funkce je uveden u každé položky (na desktopu po najetí myší na řádek).
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            {techRows.map((row, i) => (
              <SpecRow key={row.label} row={row} index={i} />
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