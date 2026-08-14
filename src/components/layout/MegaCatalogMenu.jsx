import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Sparkles, Grid2X2, CalendarDays } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const COLLECTION_META = {
  '/mestske-mlzitka': { icon: Building2, eyebrow: 'Veřejný prostor', description: 'Odolná řešení pro náměstí, parky, školy a sportoviště.' },
  '/zahradni-mlzitka': { icon: Trees, eyebrow: 'Zahrady & terasy', description: 'Minimalistická mlžítka pro soukromé a rezidenční projekty.' },
  '/zakazkova-mlzitka': { icon: Sparkles, eyebrow: 'Na míru', description: 'Autorské tvary a individuální řešení podle prostoru a zadání.' },
};

export default function MegaCatalogMenu({ open, onEnter, onLeave, onNavigate, collections, uses, customLink }) {
  const featured = collections.find((item) => item.featured);
  const rental = collections.find((item) => item.textOnly);
  const collectionLinks = collections.filter((item) => !item.featured && !item.textOnly);

  return <AnimatePresence>{open && <motion.div
    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .16 }}
    onMouseEnter={onEnter} onMouseLeave={onLeave}
    className="absolute left-0 right-0 top-full z-50 border-b border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl"
  >
    <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <section>
          <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">Produkty MLŽIDLA®</p>
              <h2 className="mt-1 font-heading text-xl font-medium text-slate-950">Vyberte podle typu projektu</h2>
            </div>
            {featured && <Link to={featured.path} onClick={onNavigate} className="group hidden items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-secondary sm:inline-flex">
              Všechny produkty <ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/>
            </Link>}
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {collectionLinks.map((item) => {
              const meta = COLLECTION_META[item.path] || {};
              const Icon = meta.icon || Grid2X2;
              return <Link key={item.label} to={item.path} onClick={onNavigate} className="group grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-xl px-2 py-3.5 transition hover:bg-slate-50">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary transition group-hover:border-secondary/40"><Icon size={17}/></span>
                <span>
                  <span className="flex items-baseline gap-2"><strong className="font-heading text-[17px] font-medium text-slate-950">{item.label}</strong><small className="hidden font-mono text-[9px] uppercase tracking-[.14em] text-slate-400 sm:inline">{meta.eyebrow}</small></span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{meta.description || item.sub}</span>
                </span>
                <ArrowRight size={16} className="mr-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-secondary"/>
              </Link>;
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
            {featured && <Link to={featured.path} onClick={onNavigate} className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-slate-800 sm:hidden"><Grid2X2 size={14}/> Všechny produkty</Link>}
            <Link to={customLink.path} onClick={onNavigate} className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"><Sparkles size={14}/> Navrhnout řešení na míru</Link>
            {rental && <Link to={rental.path} onClick={onNavigate} className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-slate-800"><CalendarDays size={14}/> {rental.label}</Link>}
          </div>
        </section>

        <section className="border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="border-b border-slate-200 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">Podle využití</p>
            <h2 className="mt-1 font-heading text-xl font-medium text-slate-950">Kam mlžítko potřebujete?</h2>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1">
            {uses.map((item) => <Link key={item.label} to={item.path} onClick={onNavigate} className="group flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">
              <item.icon size={15} className="shrink-0 text-secondary"/><span className="leading-tight">{item.label}</span>
            </Link>)}
          </div>
          <div className="mt-4 rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <p className="font-mono text-[9px] uppercase tracking-[.18em] text-cyan-300">Nevíte, co vybrat?</p>
            <div className="mt-1.5 flex items-center justify-between gap-4"><p className="text-xs leading-relaxed text-white/60">Popište prostor a doporučíme vhodný typ, počet prvků i způsob instalace.</p><Link to="/poptavka" onClick={onNavigate} className="shrink-0 text-white transition hover:text-cyan-300"><ArrowRight size={18}/></Link></div>
          </div>
        </section>
      </div>
    </div>
  </motion.div>}</AnimatePresence>;
}