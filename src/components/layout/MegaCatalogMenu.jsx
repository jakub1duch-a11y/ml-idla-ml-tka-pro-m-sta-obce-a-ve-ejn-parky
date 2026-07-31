import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MegaCollectionCard from '@/components/layout/MegaCollectionCard';
import AllProductsImageCard from '@/components/common/AllProductsImageCard';
import GoIcon from '@/components/pronajem/GoIcon';

export default function MegaCatalogMenu({ open, onEnter, onLeave, onNavigate, collections, uses, customLink }) {
  const featured = collections.find((item) => item.featured);
  const rental = collections.find((item) => item.textOnly);
  const cards = collections.filter((item) => !item.featured && !item.textOnly);
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} onMouseEnter={onEnter} onMouseLeave={onLeave} className="absolute top-full left-0 right-0 z-50 border-b border-slate-200 bg-white shadow-xl shadow-slate-900/10">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid gap-9 lg:grid-cols-[1.4fr_.9fr]">
      <div>
        <div className="mb-5"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Kolekce MLŽIDLA®</p><p className="mt-1 text-sm text-slate-500">Vyberte podle charakteru místa.</p></div>
        {featured && <div className="mb-4"><AllProductsImageCard to={featured.path} image={featured.image} compact onClick={onNavigate} /></div>}
        <div className="grid grid-cols-3 gap-4">{cards.map((item) => <MegaCollectionCard key={item.label} item={item} onNavigate={onNavigate}/>)}</div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {rental && <Link to={rental.path} onClick={onNavigate} className="group relative flex items-center justify-between overflow-visible rounded-full bg-primary py-3 pl-5 pr-20 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg">{rental.label}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/><GoIcon variant="button" /></Link>}
          <Link to={customLink.path} onClick={onNavigate} className="group flex items-center gap-3 rounded-full border border-slate-200 px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-lg"><Sparkles size={17} className="text-secondary transition-transform group-hover:rotate-12"/><span className="text-sm font-semibold text-slate-900">{customLink.label}</span></Link>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">B2B využití</p><p className="mt-1 text-sm text-slate-500">Řešení pro konkrétní provoz a typ projektu.</p><div className="mt-5 grid grid-cols-2 gap-1">{uses.map((item) => <Link key={item.label} to={item.path} onClick={onNavigate} className="group flex items-center gap-2 rounded-lg px-2 py-2.5 hover:bg-slate-50"><item.icon size={15} className="text-secondary"/><span className="text-sm text-slate-700 group-hover:text-slate-950">{item.label}</span></Link>)}</div></div>
    </div>
  </motion.div>}</AnimatePresence>;
}