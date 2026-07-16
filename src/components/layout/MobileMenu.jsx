import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MobileMenuSection from '@/components/layout/MobileMenuSection';
import { mobileNavigation } from '@/components/layout/menuData';

export default function MobileMenu({ open, onClose }) {
  return <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="fixed top-14 left-3 right-3 z-40 max-h-[75vh] overflow-y-auto border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/40 backdrop-blur-xl min-[1440px]:hidden">
    <div className="px-5 py-3">{mobileNavigation.map(item => <MobileMenuSection key={item.path} item={item} onClose={onClose} />)}</div>
    <div className="sticky bottom-0 p-4 border-t border-white/10 grid grid-cols-2 gap-3 bg-slate-950/95"><Link to="/poptavka" onClick={onClose} className="text-center border border-sky-400 text-sky-300 py-3 text-sm font-bold">Rychlá poptávka</Link><Link to="/kontakt" onClick={onClose} className="text-center bg-sky-500 text-white py-3 text-sm font-bold">Kontakt</Link></div>
  </motion.nav>}</AnimatePresence>;
}