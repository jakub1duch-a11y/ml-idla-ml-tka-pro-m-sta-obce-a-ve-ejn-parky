import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  Cpu,
  Grid2X2,
  Images,
  Layers3,
  LifeBuoy,
  Newspaper,
  Sparkles,
  X,
} from 'lucide-react';
import Logo from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ROUTE_MAP } from '@/lib/i18n';

const INTERNATIONAL_MOBILE_COPY = {
  en: { products: 'Products', city: 'Urban misting', garden: 'Garden misting', custom: 'Custom solutions', technology: 'How it works', smart: 'Smart control', references: 'Projects', about: 'About HolmTec', faq: 'FAQ', contact: 'Contact', quote: 'Request a quote' },
  de: { products: 'Produkte', city: 'Städtische Nebelanlagen', garden: 'Garten-Nebelanlagen', custom: 'Sonderanfertigung', technology: 'Funktionsweise', smart: 'Smart-Steuerung', references: 'Referenzen', about: 'Über HolmTec', faq: 'FAQ', contact: 'Kontakt', quote: 'Angebot anfragen' },
  pl: { products: 'Produkty', city: 'Systemy dla miast', garden: 'Systemy do ogrodu', custom: 'Na zamówienie', technology: 'Jak to działa', smart: 'Smart sterowanie', references: 'Realizacje', about: 'O HolmTec', faq: 'FAQ', contact: 'Kontakt', quote: 'Poproś o wycenę' },
  sk: { products: 'Produkty', city: 'Systémy pre mestá', garden: 'Systémy do záhrady', custom: 'Na mieru', technology: 'Ako to funguje', smart: 'Smart riadenie', references: 'Realizácie', about: 'O HolmTec', faq: 'FAQ', contact: 'Kontakt', quote: 'Požiadať o ponuku' },
  it: { products: 'Prodotti', city: 'Nebulizzazione urbana', garden: 'Nebulizzazione giardino', custom: 'Soluzioni su misura', technology: 'Come funziona', smart: 'Controllo smart', references: 'Progetti', about: 'Chi siamo', faq: 'FAQ', contact: 'Contatti', quote: 'Richiedi preventivo' },
};

const PRIMARY_LINKS = [
  { label: 'Produkty', sub: 'Kompletní katalog MLŽIDLA®', path: '/mlzidla-mlzitka', icon: Grid2X2 },
  { label: 'Realizace', sub: 'Hotové projekty a reference', path: '/reference', icon: Images },
  { label: 'Technologie', sub: 'Jak funguje nízkotlaké mlžení', path: '/jak-to-funguje', icon: Cpu },
  { label: 'Blog', sub: 'Inspirace, projekty a novinky', path: '/blog', icon: Newspaper },
  { label: 'Podpora', sub: 'FAQ, servis a technické informace', path: '/podpora', icon: LifeBuoy },
];

export default function MobileMenu({ open, onClose, productLinks, locale = 'cs' }) {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const collections = productLinks.filter((item) => !item.featured && !item.textOnly);

  if (locale !== 'cs') {
    const copy = INTERNATIONAL_MOBILE_COPY[locale];
    const links = [
      [copy.products, ROUTE_MAP.catalog[locale]],
      [copy.city, ROUTE_MAP.city[locale]],
      [copy.garden, ROUTE_MAP.garden[locale]],
      [copy.custom, ROUTE_MAP.custom[locale]],
      [copy.technology, ROUTE_MAP.technology[locale]],
      [copy.smart, ROUTE_MAP.smart[locale]],
      [copy.references, ROUTE_MAP.references[locale]],
      [copy.about, ROUTE_MAP.about[locale]],
      [copy.faq, ROUTE_MAP.faq[locale]],
      [copy.contact, ROUTE_MAP.contact[locale]],
    ];

    return (
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} className="fixed inset-0 z-40 flex h-[100dvh] flex-col bg-white lg:hidden">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro px-5">
              <Link to={ROUTE_MAP.home[locale]} onClick={onClose} className="flex items-center gap-2.5"><Logo size="sm" /></Link>
              <div className="flex items-center gap-2">
                <LanguageSwitcher mobile onNavigate={onClose} />
                <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"><X size={20}/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              <div className="grid grid-cols-2 gap-2">
                {links.map(([label, path], index) => (
                  <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .03 + index * .025, duration: .2 }}>
                    <Link to={path} onClick={onClose} className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-tight text-slate-800 transition hover:border-secondary/40 hover:bg-slate-50">
                      <span>{label}</span><ArrowRight size={14} className="shrink-0 text-slate-300"/>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link to={ROUTE_MAP.inquiry[locale]} onClick={onClose} className="btn-metallic-mist flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold">{copy.quote}<ArrowRight size={16}/></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .18 }}
          className="fixed inset-0 z-40 flex h-[100dvh] flex-col bg-[#f8fafb] lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro px-5">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5"><Logo size="sm" /></Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher mobile onNavigate={onClose} />
              <button onClick={onClose} aria-label="Zavřít menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><X size={20}/></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-7 pt-5 sm:px-5">
            <div className="mx-auto max-w-xl">
              <div className="px-1 pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">Hlavní navigace</p>
                <h2 className="mt-1 font-heading text-2xl font-medium tracking-[-.03em] text-slate-950">Kam chcete pokračovat?</h2>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setCollectionsOpen((value) => !value)}
                  aria-expanded={collectionsOpen}
                  className="flex min-h-[70px] w-full items-center gap-4 border-b border-slate-100 px-4 py-3.5 text-left transition hover:bg-slate-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf7fb] text-[#0b6c8e]"><Layers3 size={20}/></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-slate-950">Kolekce</span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">Městská, zahradní a zakázková řešení</span>
                  </span>
                  <ChevronDown size={17} className={`shrink-0 text-slate-400 transition-transform duration-200 ${collectionsOpen ? 'rotate-180' : ''}`}/>
                </button>

                <AnimatePresence initial={false}>
                  {collectionsOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .2, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden border-b border-slate-100 bg-slate-50/80">
                      <div className="grid gap-1 p-2.5">
                        {collections.map((item, index) => (
                          <motion.div key={item.path} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .025, duration: .16 }}>
                            <Link to={item.path} onClick={onClose} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white">
                              <span className="min-w-0"><strong className="block text-sm font-semibold text-slate-850">{item.label}</strong><span className="mt-0.5 block truncate text-[11px] text-slate-500">{item.sub}</span></span>
                              <ArrowRight size={14} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-secondary"/>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {PRIMARY_LINKS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.path} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .025 + index * .025, duration: .18 }}>
                      <Link to={item.path} onClick={onClose} className="group flex min-h-[70px] items-center gap-4 border-b border-slate-100 px-4 py-3.5 transition last:border-b-0 hover:bg-slate-50">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition group-hover:border-secondary/25 group-hover:bg-cyan-50 group-hover:text-secondary"><Icon size={19}/></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-slate-950">{item.label}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.sub}</span>
                        </span>
                        <ArrowRight size={15} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-secondary"/>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .2 }} className="mt-3">
                <Link to="/kalkulacka" onClick={onClose} className="group flex min-h-[76px] items-center gap-4 rounded-[22px] border border-cyan-200 bg-gradient-to-r from-cyan-50 to-white px-4 py-3.5 shadow-sm transition hover:border-cyan-300 hover:shadow-md">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0b4860] text-white shadow-sm"><Calculator size={20}/></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2"><strong className="text-[15px] text-slate-950">Nezávazná kalkulace</strong><span className="rounded-full bg-cyan-100 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[.12em] text-cyan-800">rychle</span></span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">Orientační provozní náklady a podklady pro projekt</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-secondary transition group-hover:translate-x-1"/>
                </Link>
              </motion.div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/smart-ovladani" onClick={onClose} className="flex min-h-12 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Smart řízení <ArrowRight size={13} className="text-slate-300"/></Link>
                <Link to="/kontakt" onClick={onClose} className="flex min-h-12 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Kontakt <ArrowRight size={13} className="text-slate-300"/></Link>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-5">
            <div className="mx-auto flex max-w-xl gap-2">
              <Link to="/poptavka" onClick={onClose} className="btn-metallic-mist flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold"><Sparkles size={15}/>Popsat projekt<ArrowRight size={15}/></Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
