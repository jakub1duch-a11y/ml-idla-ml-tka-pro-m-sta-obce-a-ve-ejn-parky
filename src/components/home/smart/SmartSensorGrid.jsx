import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplet, Wind, Radar } from 'lucide-react';

const SENSORS = [
{ icon: Thermometer, label: 'Teplota', sub: 'Spouští mlžení při přehřátí' },
{ icon: Droplet, label: 'Vlhkost', sub: 'Hlídá optimální mikroklima' },
{ icon: Wind, label: 'Vítr', sub: 'Ochrana proti snosu mlhy' },
{ icon: Radar, label: 'Pohyb', sub: 'Reaguje na přítomnost lidí' }];


export default function SmartSensorGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SENSORS.map((s, i) =>
      <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.5 }}
      className="relative p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
          <span className="absolute top-3 right-3 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <s.icon size={20} className="text-cyan-300 mb-" />
          <p className="text-sm font-semibold text-white">{s.label}</p>
          <p className="text-[11px] text-white/50 leading-snug">{s.sub}</p>
        </motion.div>
      )}
    </div>);

}