import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProductStickyFooterBar({ product, show, onPoptat }) {
  return (
    <AnimatePresence>
      {show &&
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] hidden">
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-400 hover:text-slate-900 transition-colors uppercase shrink-0">
              <ArrowLeft size={12} /> <span className="hidden sm:inline">Zpět na produkty</span>
            </Link>
            <span className="hidden md:inline text-sm font-heading font-medium text-slate-900 truncate">{product.name}</span>
            <button
            type="button"
            onClick={onPoptat}
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-slate-800 transition-colors shrink-0">
            
              Poptat produkt <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}