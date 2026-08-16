import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, Layers, Compass, Info, Grid2X2, CalendarDays } from 'lucide-react';
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

export default function MobileMenu({ open, onClose, productLinks, usageLinks, infoLinks, customLink, locale = 'cs' }) {
  const [section, setSection] = useState('katalog');
  const featured = productLinks.find((item) => item.featured);
  const rental = productLinks.find((item) => item.textOnly);
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
              <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              <LanguageSwitcher mobile onNavigate={onClose} />
              <div className="mt-5 grid grid-cols-2 gap-2">
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="fixed inset-0 z-40 flex h-[100dvh] flex-col bg-white lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro px-5">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5"><Logo size="sm" /></Link>
            <button onClick={onClose} aria-label="Zavřít menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><X size={20}/></button>
          </div>

          <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
              {[
                { id: 'katalog', label: 'Produkty', icon: Layers },
                { id: 'reseni', label: 'Využití', icon: Compass },
                { id: 'info', label: 'Informace', icon: Info },
              ].map((t) => (
                <button key={t.id} onClick={() => setSection(t.id)} className={`flex min-h-12 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition-all ${section === t.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>
                  <t.icon size={16}/><span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <AnimatePresence mode="wait">
              {section === 'katalog' && (
                <motion.div key="katalog" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
                  <div className="border-b border-slate-200 pb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">Produkty MLŽIDLA®</p>
                    <h2 className="mt-1 font-heading text-2xl font-medium text-slate-950">Vyberte podle typu projektu</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">Stejná logika jako v desktopovém mega menu — bez obrázků, rychle a přehledně.</p>
                  </div>

                  <div className="mt-2 divide-y divide-slate-100">
                    {collections.map((item) => (
                      <Link key={item.path} to={item.path} onClick={onClose} className="group flex items-center justify-between gap-4 rounded-xl px-1 py-4 transition hover:bg-slate-50">
                        <div className="min-w-0">
                          <h3 className="font-heading text-lg font-medium text-slate-950">{item.label}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.sub}</p>
                        </div>
                        <ArrowRight size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-secondary"/>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
                    {featured && <Link to={featured.path} onClick={onClose} className="btn-secondary-outline flex items-center justify-between rounded-full px-5 py-3 text-sm font-bold text-slate-900"><span className="flex items-center gap-2"><Grid2X2 size={15}/> Všechny produkty</span><ArrowRight size={15}/></Link>}
                    <Link to={customLink.path} onClick={onClose} className="btn-metallic-mist flex items-center justify-between rounded-full px-5 py-3 text-sm font-bold"><span className="flex items-center gap-2"><Sparkles size={15}/> Navrhnout řešení na míru</span><ArrowRight size={15}/></Link>
                    {rental && <Link to={rental.path} onClick={onClose} className="btn-secondary-outline flex items-center justify-between rounded-full px-5 py-3 text-sm font-bold text-slate-900"><span className="flex items-center gap-2"><CalendarDays size={15}/> {rental.label}</span><ArrowRight size={15}/></Link>}
                  </div>
                </motion.div>
              )}

              {section === 'reseni' && (
                <motion.div key="reseni" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
                  <div className="border-b border-slate-200 pb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">Podle využití</p>
                    <h2 className="mt-1 font-heading text-2xl font-medium text-slate-950">Kam mlžítko potřebujete?</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">Vyberte typ prostoru a zobrazíme řešení, produkty a reference vhodné pro dané použití.</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {usageLinks.map((l) => (
                      <Link key={l.path} to={l.path} onClick={onClose} className="group flex min-h-24 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-secondary/40 hover:bg-slate-50">
                        <l.icon size={18} className="text-secondary"/>
                        <span className="mt-4 text-sm font-semibold leading-tight text-slate-800">{l.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-white">
                    <p className="font-mono text-[9px] uppercase tracking-[.18em] text-cyan-300">Nevíte, co vybrat?</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">Popište prostor a doporučíme vhodný typ, počet prvků i způsob instalace.</p>
                    <Link to="/poptavka" onClick={onClose} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">Popsat projekt <ArrowRight size={15}/></Link>
                  </div>
                </motion.div>
              )}

              {section === 'info' && (
                <motion.div key="info" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
                  <div className="border-b border-slate-200 pb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary">Informace a podpora</p>
                    <h2 className="mt-1 font-heading text-2xl font-medium text-slate-950">Technika, servis a inspirace</h2>
                  </div>
                  <div className="mt-3 space-y-1">
                    {infoLinks.map((l) => (
                      <Link key={l.path} to={l.path} onClick={onClose} className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${l.featured ? 'border border-cyan-200 bg-cyan-50' : 'hover:bg-slate-50'}`}>
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${l.featured ? 'border-cyan-200 bg-white text-cyan-700' : 'border-slate-200 bg-white text-secondary'}`}><l.icon size={16}/></span>
                        <span className={`text-sm ${l.featured ? 'font-semibold text-slate-950' : 'font-medium text-slate-700'}`}>{l.label}</span>
                        {l.featured && <span className="ml-auto rounded-full border border-cyan-200 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[.14em] text-cyan-700">Nové</span>}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Jak fungují', path: '/jak-to-funguje' },
                  { label: 'Chytré ovládání', path: '/smart-ovladani' },
                  { label: 'Reference', path: '/reference' },
                  { label: 'Kontakt', path: '/kontakt' },
                ].map((l) => <Link key={l.path} to={l.path} onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">{l.label}</Link>)}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link to="/poptavka" onClick={onClose} className="btn-metallic-mist flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold">Popsat projekt <ArrowRight size={16}/></Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}