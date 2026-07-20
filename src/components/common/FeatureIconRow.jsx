import React from 'react';
import { motion } from 'framer-motion';

// Light, icon-based feature row (inspired by premium product pages) —
// e.g. <FeatureIconRow items={[{ icon: Droplets, label: 'Spotřeba vody', value: '4,6 l/h' }]} />
export default function FeatureIconRow({ items = [], className = '' }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      {items.map((item, i) =>
      <motion.div
        key={item.label}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08 }}
        className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
            <item.icon size={18} className="text-slate-700 size-" />
          </div>
          <p className="font-medium leading-tight text-s text-slate-900">{item.label}</p>
          {item.value && <p className="text-slate-500 leading-tight text-2xl">{item.value}</p>}
        </motion.div>
      )}
    </div>);

}