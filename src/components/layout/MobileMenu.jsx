import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MobileMenuSection from '@/components/layout/MobileMenuSection';
import { mobileNavigation } from '@/components/layout/menuData';

export default function MobileMenu({ open, onClose }) {
  return <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto border-t border-white/10 bg-slate-950/95 backdrop-blur-xl xl:hidden">
    <div className="px-5 py-3">{mobileNavigation.map(item => <MobileMenuSection key={item.path} item={item} onClose={onClose} />)}</div>
    <div className="sticky bottom-0 p-4 border-t border-white/10 grid grid-cols-2 gap-3 bg-slate-950/95"><Link to="/poptavka" onClick={onClose} className="text-center border border-sky-400 text-sky-300 py-3 text-sm font-bold">Rychlá poptávka</Link><Link to="/kontakt" onClick={onClose} className="text-center bg-sky-500 text-white py-3 text-sm font-bold">Kontakt</Link></div>
  </motion.nav>}</AnimatePresence>;
}