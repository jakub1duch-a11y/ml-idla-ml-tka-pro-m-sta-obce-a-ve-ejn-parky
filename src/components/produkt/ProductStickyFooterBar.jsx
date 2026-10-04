import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ScanLine } from 'lucide-react';

export default function ProductStickyFooterBar({ product, show, onPoptat }) {
  return (
    <AnimatePresence>
      {show &&
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-400 hover:text-slate-900 transition-colors uppercase shrink-0">
              <ArrowLeft size={12} /> <span className="hidden sm:inline">Zpět na produkty</span>
            </Link>
            <span className="hidden md:inline text-sm font-heading font-medium text-slate-900 truncate">{product.name}</span>
            <div className="ml-auto flex items-center gap-2">
              <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
                className="hidden sm:inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#0b4860]/20 bg-white px-4 text-xs font-bold text-[#0b4860] transition-colors hover:bg-slate-50">
                Vizualizovat <ScanLine size={14} />
              </Link>
              <button
                type="button"
                onClick={onPoptat}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#0b4860] px-4 sm:px-6 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#08394c] shrink-0">
                Poptat {product.name} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}