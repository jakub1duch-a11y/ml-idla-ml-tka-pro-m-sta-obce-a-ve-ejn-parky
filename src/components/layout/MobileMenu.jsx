import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';

const LINKS = [
  { label: 'Produkty', path: '/mlzidla-mlzitka' },
  { label: 'Mlžítka a mlžné brány', path: '/mlzidla-mlzitka' },
  { label: 'Smart moduly a příslušenství', path: '/prislusenstvi' },
  { label: 'Přínosy mlžítek', path: '/prinosy-mlzitek/zvyseni-trzeb-a-prodeje' },
  { label: 'Reference', path: '/reference' },
  { label: 'Novinky', path: '/blog' },
  { label: 'Podpora', path: '/podpora' },
  { label: 'Kontakt', path: '/kontakt' },
];

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950 lg:hidden flex flex-col pt-16">
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0"><Link to="/" onClick={onClose} className="bg-black/75 px-3 py-0"><Logo size="sm" /></Link><button onClick={onClose} aria-label="Zavřít menu" className="w-11 h-11 flex items-center justify-center rounded-full text-white hover:bg-white/10"><X size={21} /></button></div>
      <nav className="flex-1 overflow-y-auto px-6 py-7"><div className="flex flex-col">{LINKS.map((link, index) => <motion.div key={link.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}><Link to={link.path} onClick={onClose} className="flex items-center justify-between py-4 border-b border-white/10 text-white text-lg font-medium hover:text-cyan transition-colors">{link.label}<ArrowRight size={17} className="text-white/45" /></Link></motion.div>)}</div></nav>
      <div className="p-6 border-t border-white/10"><Link to="/poptavka" onClick={onClose} className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-slate-950 text-sm font-bold rounded-full">Nezávazná poptávka <ArrowRight size={16} /></Link></div>
    </motion.div>}</AnimatePresence>
  );
}