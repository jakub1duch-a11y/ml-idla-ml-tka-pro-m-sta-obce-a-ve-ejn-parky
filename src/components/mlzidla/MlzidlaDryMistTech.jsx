import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wind, Snowflake } from 'lucide-react';

const STEPS = [
  { icon: Flame, label: 'Mikrokapky', sub: 'Tlak 70 bar, tryska 5–10 µm' },
  { icon: Wind, label: 'Absorpce tepla', sub: 'Kapka pohlcuje okolní teplo' },
  { icon: Snowflake, label: 'Odpar', sub: 'Chladný vzduch bez vlhkosti' },
];

export default function MlzidlaDryMistTech() {
  return (
    <section className="bg-black py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brushed/60 mb-3">02 — Technologie</p>
        <h2 className="font-heading font-black text-3xl lg:text-4xl text-white uppercase tracking-tight mb-14">Technologie suché mlhy</h2>

        <div
          className="relative border border-brushed/30 p-8 lg:p-16"
          style={{ background: 'linear-gradient(90deg, #FF6A3D 0%, #7a3a2a 30%, #1a1a1a 50%, #1a3a4a 70%, #4DA8FF 100%)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  {i < 2 && <div className="hidden md:block absolute top-7 left-full w-8 h-[2px] bg-brushed/60 z-10" />}
                  <div
                    className="p-6 border border-white/30"
                    style={{ background: 'linear-gradient(135deg, #d8d8d8 0%, #b8b8b8 45%, #e8e8e8 55%, #c0c0c0 100%)' }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-black mb-4">
                      <Icon size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-1">{step.label}</h3>
                    <p className="text-black/60 text-xs">{step.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between mt-8 text-[10px] font-mono tracking-widest uppercase">
            <span className="text-white/80">Teplo</span>
            <span className="text-white/80">Chlad</span>
          </div>
        </div>
      </div>
    </section>
  );
}