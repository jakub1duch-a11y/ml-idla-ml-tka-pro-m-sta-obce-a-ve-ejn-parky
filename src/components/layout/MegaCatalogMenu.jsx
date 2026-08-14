import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import GoIcon from '@/components/pronajem/GoIcon';

export default function MegaCatalogMenu({ open, onEnter, onLeave, onNavigate, collections, uses, customLink }) {
  const featured = collections.find((item) => item.featured);
  const rental = collections.find((item) => item.textOnly);
  const links = collections.filter((item) => !item.featured && !item.textOnly);

  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} onMouseEnter={onEnter} onMouseLeave={onLeave} className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-xl shadow-slate-900/10">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
      <div>
        <div className="mb-5">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Kolekce MLŽIDLA®</p>
          <p className="mt-1 text-sm text-slate-500">Vyberte podle charakteru místa.</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {featured && <Link to={featured.path} onClick={onNavigate} className="group col-span-full flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 transition hover:border-secondary hover:bg-slate-50">
            <div><p className="font-heading text-xl text-slate-950">{featured.label}</p><p className="mt-1 text-sm text-slate-500">{featured.sub}</p></div><ArrowRight size={17} className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
          </Link>}

          {links.map((item) => <Link key={item.label} to={item.path} onClick={onNavigate} className="group flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 transition hover:border-secondary hover:bg-slate-50">
            <div><p className="font-heading text-lg text-slate-950">{item.label}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{item.sub}</p></div><ArrowRight size={15} className="ml-3 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
          </Link>)}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {rental && <Link to={rental.path} onClick={onNavigate} className="group relative flex items-center justify-between overflow-visible rounded-full bg-primary py-3 pl-5 pr-20 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg">{rental.label}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/><GoIcon variant="button" /></Link>}
          <Link to={customLink.path} onClick={onNavigate} className="btn-secondary-outline group flex items-center gap-3 rounded-full px-5 py-3 text-slate-900"><Sparkles size={17} className="text-secondary transition-transform group-hover:rotate-12"/><span className="text-sm font-semibold">{customLink.label}</span></Link>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">B2B využití</p>
        <p className="mt-1 text-sm text-slate-500">Řešení pro konkrétní provoz a typ projektu.</p>
        <div className="mt-5 grid grid-cols-2 gap-1">{uses.map((item) => <Link key={item.label} to={item.path} onClick={onNavigate} className="group flex items-center gap-2 rounded-lg px-2 py-2.5 hover:bg-slate-50"><item.icon size={15} className="text-secondary"/><span className="text-sm text-slate-700 group-hover:text-slate-950">{item.label}</span></Link>)}</div>
      </div>
    </div>
  </motion.div>}</AnimatePresence>;
}
