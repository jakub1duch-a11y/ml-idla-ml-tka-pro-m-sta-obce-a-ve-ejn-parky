import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function MobileMenuSection({ item, onClose }) {
  const [open, setOpen] = useState(false);
  if (!item.links) return <Link to={item.path} onClick={onClose} className="flex items-center justify-between py-3.5 border-b border-white/10 text-white text-base"><span>{item.label}</span><ArrowRight size={16} className="text-white/40" /></Link>;
  return <div className="border-b border-white/10">
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between py-3.5 text-left text-white text-base">
      <span>{item.label}</span><ChevronDown size={18} className={`text-cyan transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence initial={false}>
      {open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }} className="overflow-hidden">
        <div className="pb-4 pl-4 border-l border-cyan/40 space-y-1">
          <Link to={item.path} onClick={onClose} className="block py-2 text-xs font-bold uppercase tracking-wider text-cyan">Zobrazit vše</Link>
          {item.links.map(([label, path]) => <Link key={path} to={path} onClick={onClose} className="block py-2 text-sm text-white/70 hover:text-white">{label}</Link>)}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}