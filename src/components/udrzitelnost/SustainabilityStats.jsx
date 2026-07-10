import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Zap, Recycle } from 'lucide-react';

const STATS = [
{ icon: Thermometer, value: 'až −10 °C', label: 'ochlazení okolního vzduchu' },
{ icon: Droplets, value: '38 l/h', label: 'spotřeba vody na jedno mlžítko' },
{ icon: Zap, value: '0 freonů', label: 'chlazení bez klimatizace' },
{ icon: Recycle, value: '100 %', label: 'recyklovatelný nerez AISI 316L' }];


export default function SustainabilityStats() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s, i) =>
        <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <s.icon size={20} className="text-cyan mx-auto mb-3" />
            <p className="text-2xl font-heading font-light text-white mb-1">{s.value}</p>
            <p className="text-xs text-white/50 leading-snug">{s.label}</p>
          </motion.div>
        )}
      </div>
    </section>);

}