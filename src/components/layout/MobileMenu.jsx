import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';

export default function MobileMenu({ open, onClose, productLinks, usageLinks, infoLinks, customLink }) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <AnimatePresence>
      {open &&
      <>
          {/* Dimmed backdrop — tap to close, keeps rest of page visible */}
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" />

          {/* Floating panel — compact, not full screen */}
          <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed top-[72px] left-2 right-2 z-40 max-h-[78dvh] overflow-y-auto overscroll-contain rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl shadow-slate-900/20 lg:hidden">

            <div className="px-3 py-3 flex flex-col gap-1">
              <button onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center justify-between text-sm font-bold text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors py-3.5 px-4 rounded-2xl">
                Katalog <ChevronDown size={16} className={`transition-transform duration-150 ${catalogOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catalogOpen &&
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden">
                    <div className="flex flex-col gap-0 py-3 bg-slate-50 rounded-2xl mb-1 px-3">
                      <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-1 mb-3 px-1">Produkty</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {productLinks.map((p) =>
                    <Link key={p.path} to={p.path} onClick={onClose} className="flex flex-col gap-1.5">
                            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                              <img src={p.image} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <p className="text-xs font-medium text-slate-700 leading-tight">{p.label}</p>
                          </Link>
                    )}
                      </div>
                      <Link to={customLink.path} onClick={onClose} className="text-sm font-medium text-slate-900 mt-4 mb-1 px-1">{customLink.label} — {customLink.sub}</Link>
                      <Link to="/mlzidla-mlzitka" onClick={onClose} className="text-sm font-medium text-slate-900 mt-1 mb-2 px-1">Celá kolekce →</Link>
                      <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-3 mb-2 px-1">B2B využití</p>
                      <div className="grid grid-cols-3 gap-2 pb-1">
                        {usageLinks.map((l) =>
                    <Link key={l.path} to={l.path} onClick={onClose} className="flex flex-col items-center justify-center text-center gap-1.5 py-3 px-1 min-h-[60px] rounded-xl hover:bg-white active:bg-white transition-colors">
                            <l.icon size={17} className={`${l.color} opacity-80`} />
                            <p className="text-[10px] font-medium text-slate-700 leading-tight">{l.label}</p>
                          </Link>
                    )}
                      </div>
                    </div>
                  </motion.div>
              }
              </AnimatePresence>

              <button onClick={() => setInfoOpen(!infoOpen)}
              className="flex items-center justify-between text-sm font-bold text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors py-3.5 px-4 rounded-2xl">
                Informace a podpora <ChevronDown size={16} className={`transition-transform duration-150 ${infoOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {infoOpen &&
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden">
                    <div className="flex flex-col gap-0.5 py-2 bg-slate-50 rounded-2xl mb-1">
                      <Link to="/blog" onClick={onClose} className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white active:bg-white py-3 px-5 rounded-xl transition-colors">Blog & novinky</Link>
                      <Link to="/o-nas" onClick={onClose} className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white active:bg-white py-3 px-5 rounded-xl transition-colors">O společnosti</Link>
                      {infoLinks.map((l) =>
                  <Link key={l.path} to={l.path} onClick={onClose} className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white active:bg-white py-3 px-5 rounded-xl transition-colors">{l.label}</Link>
                  )}
                    </div>
                  </motion.div>
              }
              </AnimatePresence>

              {[
              { label: 'Reference', path: '/reference' },
              { label: 'Kontakt', path: '/kontakt' }].
              map((l) =>
              <Link key={l.path} to={l.path} onClick={onClose} className="text-sm font-bold text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors py-3.5 px-4 rounded-2xl">{l.label}</Link>
              )}
            </div>

            {/* Sticky bottom CTA — thumb-reachable primary action */}
            <div className="sticky bottom-0 px-3 pt-2 pb-3 bg-gradient-to-t from-white via-white/95 to-transparent">
              <Link to="/poptavka" onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl active:scale-[0.98] transition-transform">
                <Sparkles size={16} /> Rychlá poptávka <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}