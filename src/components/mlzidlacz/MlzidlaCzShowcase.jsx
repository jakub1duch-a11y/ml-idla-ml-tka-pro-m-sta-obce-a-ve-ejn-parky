import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MlzidlaCzShowcase({ product, onPrev, onNext }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 h-full flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div key={product.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col h-full">
          <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">{product.category}</p>
          <h1 className="font-heading font-black text-4xl lg:text-6xl text-slate-900 tracking-tight leading-none mb-4">{product.name}</h1>
          <div className="w-14 h-1 bg-blue-600 mb-5" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 items-center flex-1">
            <div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{product.description}</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description2}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-3 rounded-full transition-colors">
                  Více informací <ArrowRight size={15} />
                </Link>
                <Link to="/ke-stazeni" className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 text-sm font-bold px-5 py-3 rounded-full hover:bg-slate-50 transition-colors">
                  Technické parametry <FileText size={14} />
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <button onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                <ChevronLeft size={16} className="text-slate-700" />
              </button>
              <button onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                <ChevronRight size={16} className="text-slate-700" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}