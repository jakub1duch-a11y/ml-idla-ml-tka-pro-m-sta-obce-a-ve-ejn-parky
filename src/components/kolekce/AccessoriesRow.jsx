import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench } from 'lucide-react';

export default function AccessoriesRow({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Wrench size={16} className="text-slate-900" />
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400">Příslušenství k mlžítkům</p>
            <h3 className="text-lg font-normal text-slate-900">Trysky a kotvení pro váš model</h3>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-slate-50">
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white border border-slate-200">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">⚙</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-900 truncate">{p.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{p.short_description}</p>
              </div>
              <Link to={p.slug ? `/produkt/${p.slug}` : '/kontakt'}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 shrink-0 group-hover:gap-2 transition-all">
                Detail <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}