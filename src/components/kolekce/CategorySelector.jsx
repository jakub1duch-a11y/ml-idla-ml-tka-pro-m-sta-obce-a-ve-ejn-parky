import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CategorySelector({ groups, activeCategory, onSelect }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-20 hidden">
      <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Vyberte kategorii</p>
        <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Tři cesty k dokonalému chlazení.</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {groups.map((g, i) => {
          const Icon = g.icon;
          const active = activeCategory === g.id;
          return (
            <motion.button
              key={g.id}
              onClick={() => onSelect(active ? null : g.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`group relative text-left p-7 rounded-2xl border overflow-hidden transition-colors duration-300 ${active ? 'border-slate-900 bg-slate-900' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              
              <motion.div
                initial={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.12, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${active ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                
                <Icon size={22} className={active ? 'text-white' : 'text-slate-900'} />
              </motion.div>
              <h3 className={`text-lg font-normal mb-1.5 transition-colors ${active ? 'text-white' : 'text-slate-900'}`}>{g.label}</h3>
              <p className={`text-sm italic font-light mb-3 transition-colors ${active ? 'text-white/50' : 'text-slate-400'}`}>{g.tagline}</p>
              <p className={`text-xs leading-relaxed mb-4 transition-colors ${active ? 'text-white/60' : 'text-slate-500'}`}>{g.description}</p>
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${active ? 'text-white' : 'text-slate-900'} group-hover:gap-2.5`}>
                {active ? 'Zobrazeno' : 'Zobrazit produkty'} <ArrowRight size={13} />
              </div>
            </motion.button>);

        })}
      </div>
    </div>);

}