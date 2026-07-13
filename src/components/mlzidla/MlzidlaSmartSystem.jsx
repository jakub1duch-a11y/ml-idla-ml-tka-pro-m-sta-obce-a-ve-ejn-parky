import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Gauge, Thermometer, Wifi } from 'lucide-react';

const MODULES = [
  { icon: Sun, label: 'Solární modul', desc: 'Nezávislé napájení instalace' },
  { icon: Gauge, label: 'Automatické ventily', desc: 'Řízení průtoku dle podmínek' },
  { icon: Thermometer, label: 'Teplotní čidlo', desc: 'Spouští mlžení při zvolené teplotě' },
  { icon: Wifi, label: 'Wi-Fi ovládání', desc: 'Vzdálená správa přes aplikaci' },
];

export default function MlzidlaSmartSystem() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-black/40 mb-3">05 — Smart systém</p>
        <h2 className="font-heading font-black text-3xl lg:text-4xl text-black uppercase tracking-tight mb-14">Chytré řízení mlžení</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-black/15">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-7 border-black/15 border-r border-b lg:border-b-0 last:border-r-0 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r"
                style={{ background: 'linear-gradient(160deg, #f4f4f4 0%, #e2e2e2 100%)' }}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black mb-4">
                  <Icon size={18} className="text-techblue" strokeWidth={1.5} />
                </div>
                <h3 className="text-black text-sm font-bold uppercase tracking-wide mb-1.5">{m.label}</h3>
                <p className="text-black/50 text-xs leading-relaxed">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}