import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const choose = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible &&
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-[60] bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl border border-white/10 shadow-2xl shadow-black/30 p-5">
        <button onClick={() => choose('dismissed')} aria-label="Zavřít" className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-start gap-3 mb-4 pr-5">
          <div className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
            <Cookie size={16} className="text-cyan" />
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Používáme cookies pro zlepšení fungování webu.{' '}
            Podrobnější informace najdete v našich{' '}
            <Link to="/gdpr" className="text-cyan hover:underline">Zásadách ochrany osobních údajů a používání souborů cookies</Link>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => choose('essential')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium transition-colors">
            Pouze nezbytné
          </button>
          <button onClick={() => choose('accepted')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-cyan text-ink hover:bg-cyan/90 text-xs font-bold transition-colors">
            Přijmout vše
          </button>
        </div>
      </motion.div>
      }
    </AnimatePresence>);

}