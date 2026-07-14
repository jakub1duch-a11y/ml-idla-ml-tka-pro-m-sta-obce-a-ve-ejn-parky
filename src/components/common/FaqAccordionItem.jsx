import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
        <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-700'}`}>
          {question}
        </span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
            <div className="px-6 pb-5 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 leading-relaxed font-light border-l-2 border-cyan-400 pl-4">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}