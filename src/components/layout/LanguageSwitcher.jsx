import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { getLocaleFromPath, getSwitchTargets } from '@/lib/i18n';

export default function LanguageSwitcher({ mobile = false, onNavigate = undefined }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const locale = getLocaleFromPath(location.pathname);
  const targets = getSwitchTargets(location.pathname);
  const active = targets.find((item) => item.code === locale) || targets[0];

  if (mobile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-3 flex items-center gap-2 px-1">
          <Globe2 size={15} className="text-secondary" />
          <span className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-500">Language / Jazyk</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {targets.map((item, index) => (
            <motion.div key={item.code} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025, duration: .18 }}>
              <Link
                to={item.path}
                onClick={onNavigate}
                hrefLang={item.hreflang}
                lang={item.htmlLang}
                className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 text-xs font-semibold transition ${item.code === locale ? 'border-secondary bg-secondary text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-secondary/40'}`}
              >
                {item.label}{item.code === locale && <Check size={12} />}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Změnit jazyk webu"
        className={`flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold tracking-wide transition ${open ? 'border-white/30 bg-white/15 text-white' : 'border-white/15 bg-white/[.06] text-white/85 hover:border-white/30 hover:bg-white/10'}`}
      >
        <Globe2 size={14} />
        <motion.span key={active.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>{active.label}</motion.span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .98 }}
            transition={{ duration: .16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-[80] w-52 overflow-hidden rounded-2xl border border-white/15 bg-[#082a37]/98 p-2 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
          >
            {targets.map((item, index) => (
              <motion.div key={item.code} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .025, duration: .14 }}>
                <Link
                  to={item.path}
                  hrefLang={item.hreflang}
                  lang={item.htmlLang}
                  onClick={() => { setOpen(false); onNavigate?.(); }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${item.code === locale ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}
                >
                  <span className="flex items-center gap-3"><strong className="w-6 text-xs">{item.label}</strong><span className="text-sm">{item.nativeName}</span></span>
                  {item.code === locale && <motion.span layoutId="language-active"><Check size={14} className="text-cyan-300" /></motion.span>}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
