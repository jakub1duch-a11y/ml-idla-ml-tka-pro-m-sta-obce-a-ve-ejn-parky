import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Box, Factory, HardHat } from 'lucide-react';

const STEPS = [
  { icon: PenTool, label: 'Návrh' },
  { icon: Box, label: 'CAD' },
  { icon: Factory, label: 'Výroba' },
  { icon: HardHat, label: 'Instalace' },
];

export default function MlzidlaInstallation() {
  return (
    <section className="bg-black py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brushed/60 mb-3">04 — Instalace</p>
        <h2 className="font-heading font-black text-3xl lg:text-4xl text-white uppercase tracking-tight mb-6">Stálá / mobilní instalace</h2>
        <p className="text-brushed/60 text-sm max-w-xl mb-14">Od koncepčního návrhu po finální montáž na místě — kompletní proces řízený vlastní CNC výrobou.</p>

        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-brushed/10 via-brushed/60 to-brushed/10" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center border border-white/30 mb-4"
                  style={{ background: 'linear-gradient(135deg, #d8d8d8 0%, #b8b8b8 45%, #e8e8e8 55%, #c0c0c0 100%)' }}
                >
                  <Icon size={22} className="text-black" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-brushed/40 mb-1">0{i + 1}</span>
                <h3 className="text-white text-sm font-bold uppercase tracking-wide">{s.label}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}