import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, Layers, Compass, Info } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function MobileMenu({ open, onClose, productLinks, usageLinks, infoLinks, customLink }) {
  const [section, setSection] = useState('katalog');

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-white lg:hidden flex flex-col h-[100dvh]">

          {/* Header bar */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro shrink-0">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
              <Logo size="sm" />
            </Link>
            <button onClick={onClose} aria-label="Zavřít menu"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Section tabs */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-slate-100 shrink-0">
            {[
              { id: 'katalog', label: 'Katalog', icon: Layers },
              { id: 'reseni', label: 'Využití', icon: Compass },
              { id: 'info', label: 'Informace', icon: Info },
            ].map((t) => (
              <button key={t.id} onClick={() => setSection(t.id)}
                className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-2 text-xs font-semibold transition-all ${section === t.id ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                <t.icon size={19} />{t.label}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
            <AnimatePresence mode="wait">
              {section === 'katalog' &&
              <motion.div key="katalog" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Naše kolekce 2026</p>
                    <h2 className="font-heading font-semibold text-xl text-slate-900">Mlžítka a mlžné sochy</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {productLinks.filter((p) => !p.textOnly).map((p) =>
                  <Link key={p.path} to={p.path} onClick={onClose} className="group flex flex-col gap-2">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                        <img src={p.image} alt={p.label} className="w-full h-full object-cover group-active:scale-95 transition-transform" loading="lazy" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{p.label}</p>
                        <p className="text-xs text-slate-400 leading-tight">{p.sub}</p>
                      </div>
                    </Link>
                  )}
                </div>
                {productLinks.filter((p) => p.textOnly).map((p) =>
                <Link key={p.path} to={p.path} onClick={onClose} className="mb-4 flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white">
                    {p.label} <ArrowRight size={15} />
                  </Link>
                )}
                <Link to={customLink.path} onClick={onClose}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-3">
                  <Sparkles size={18} className="text-slate-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{customLink.label}</p>
                    <p className="text-xs text-slate-400">{customLink.sub}</p>
                  </div>
                </Link>
                <Link to="/mlzidla-mlzitka" onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-slate-900 text-slate-900 text-sm font-bold hover:bg-slate-900 hover:text-white transition-colors">
                  Prohlédnout celou kolekci <ArrowRight size={15} />
                </Link>
              </motion.div>
              }

              {section === 'reseni' &&
              <motion.div key="reseni" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Pro každý obor</p>
                <h2 className="font-heading font-semibold text-xl text-slate-900 mb-5">Řešení dle využití</h2>
                <div className="grid grid-cols-2 gap-3">
                  {usageLinks.map((l) =>
                  <Link key={l.path} to={l.path} onClick={onClose}
                    className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                    <l.icon size={20} className={`${l.color} opacity-90`} />
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{l.label}</p>
                  </Link>
                  )}
                </div>
              </motion.div>
              }

              {section === 'info' &&
              <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Poznejte firmu</p>
                <h2 className="font-heading font-semibold text-xl text-slate-900 mb-5">Informace a podpora</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {infoLinks.map((l) =>
                  <Link key={l.path} to={l.path} onClick={onClose} className="flex min-h-24 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300">
                    <l.icon size={20} className="text-slate-500" /><span className="mt-3 leading-tight">{l.label}</span>
                  </Link>
                  )}
                </div>
              </motion.div>
              }
            </AnimatePresence>

            <div className="flex flex-col gap-1 pt-4 mt-2 border-t border-slate-100">
              {[
              { label: 'Reference', path: '/reference' },
              { label: 'Kontakt', path: '/kontakt' }].
              map((l) =>
              <Link key={l.path} to={l.path} onClick={onClose} className="text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors py-3.5 px-4 rounded-xl">{l.label}</Link>
              )}
            </div>
          </div>

          {/* Sticky bottom CTA */}
          <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white">
            <Link to="/poptavka" onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl active:scale-[0.98] transition-transform">
              <Sparkles size={16} /> Popsat projekt <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}