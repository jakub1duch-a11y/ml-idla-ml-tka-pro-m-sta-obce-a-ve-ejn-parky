import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { getLocaleFromPath, getSwitchTargets } from '@/lib/i18n';

const FLAGS = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
  pl: '🇵🇱',
  sk: '🇸🇰',
  it: '🇮🇹',
};

const LABELS = {
  cs: 'Změnit jazyk webu',
  en: 'Change website language',
  de: 'Sprache der Website ändern',
  pl: 'Zmień język strony',
  sk: 'Zmeniť jazyk webu',
  it: 'Cambia lingua del sito',
};

export default function LanguageSwitcher({ mobile = false, onNavigate = undefined }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const locale = getLocaleFromPath(location.pathname);
  const targets = getSwitchTargets(location.pathname);
  const active = targets.find((item) => item.code === locale) || targets[0];
  const ariaLabel = LABELS[locale] || LABELS.en;

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className={`relative ${mobile ? 'w-fit' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={mobile
          ? `flex min-h-11 items-center gap-1.5 rounded-full border px-3 transition ${open ? 'border-slate-300 bg-white text-slate-950' : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-white'}`
          : `flex min-h-10 items-center gap-1.5 rounded-full border px-2.5 transition ${open ? 'border-white/30 bg-white/15 text-white' : 'border-white/15 bg-white/[.06] text-white/90 hover:border-white/30 hover:bg-white/10'}`}
      >
        <motion.span
          key={active.code}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .16 }}
          className="text-[18px] leading-none"
          aria-hidden="true"
        >
          {FLAGS[active.code]}
        </motion.span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -7, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: .985 }}
            transition={{ duration: .16, ease: [0.22, 1, 0.36, 1] }}
            className={mobile
              ? 'absolute left-0 top-[calc(100%+8px)] z-[90] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-950/10'
              : 'absolute right-0 top-[calc(100%+8px)] z-[90] w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#082a37]/98 p-1.5 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl'}
          >
            <div role="listbox" aria-label={ariaLabel} className="max-h-64 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin]">
              {targets.map((item, index) => {
                const isActive = item.code === locale;
                return (
                  <motion.div
                    key={item.code}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * .018, duration: .13 }}
                  >
                    <Link
                      to={item.path}
                      hrefLang={item.hreflang}
                      lang={item.htmlLang}
                      role="option"
                      aria-selected={isActive}
                      onClick={close}
                      className={mobile
                        ? `flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition ${isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-700 hover:bg-slate-50'}`
                        : `flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition ${isActive ? 'bg-white/12 text-white' : 'text-white/72 hover:bg-white/8 hover:text-white'}`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="text-[19px] leading-none" aria-hidden="true">{FLAGS[item.code]}</span>
                        <span className="min-w-0 truncate text-sm font-medium">{item.nativeName}</span>
                      </span>
                      {isActive && <Check size={14} className={mobile ? 'text-secondary' : 'text-cyan-300'} />}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
