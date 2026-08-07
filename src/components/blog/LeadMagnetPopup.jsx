import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'lead_magnet_dismissed';

export default function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 12000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.NewsletterLead.create({ email, source: 'blog_popup' });
    setSending(false);
    setDone(true);
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), 2500);
  };

  return (
    <AnimatePresence>
      {visible &&
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:max-w-sm z-[60] bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl border border-cyan/20 shadow-2xl shadow-black/30 p-6 hidden">
        <button onClick={close} aria-label="Zavřít" className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors">
          <X size={16} />
        </button>

        {done ?
        <div className="text-center py-2">
            <Sparkles className="mx-auto mb-2 text-cyan" size={22} />
            <p className="text-sm text-white/80">Děkujeme! Kalkulaci a slevu 15 % vám pošleme na e-mail.</p>
          </div> :

        <>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan/10 border border-cyan/25 text-cyan text-[11px] font-mono tracking-widest uppercase rounded-full mb-3">
              <Sparkles size={12} /> Ještě není konec léta
            </span>
            <h3 className="font-heading font-semibold text-lg text-white leading-snug mb-2">
              Ochlaďte léto o 9 °C — a tržby udržte nahoře.
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              Nechte si zdarma zpracovat nezávaznou kalkulaci mlžení do 24 hodin a získejte 15 % slevu na první objednávku.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input type="email" required placeholder="Váš e-mail" value={email} onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
              <button type="submit" disabled={sending}
            className="px-4 py-2.5 bg-cyan text-ink text-sm font-bold rounded-xl hover:bg-cyan/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {sending ? <Loader size={14} className="animate-spin" /> : 'Chci slevu 15 %'}
              </button>
            </form>
          </>
        }
        </motion.div>
      }
    </AnimatePresence>);

}