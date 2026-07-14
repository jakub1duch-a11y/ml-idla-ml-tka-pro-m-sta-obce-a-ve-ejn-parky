import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Radio, Play, X } from 'lucide-react';

const VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/42cf4b972_Efektmlhy-mlznabrana-zivynahled.mov';

export default function GateLiveDemoCard() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => e.key === 'Escape' && setLightboxOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 sm:mb-16">
      <div className="group relative block rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all min-h-[280px]">
        <video
          src={VIDEO_URL}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        <div className="relative flex flex-col justify-end min-h-[280px] p-7 lg:p-9">
          <button type="button" onClick={() => setLightboxOpen(true)}
            className="inline-flex items-center gap-1.5 self-start mb-4 text-[10px] font-mono text-white tracking-widest uppercase px-3 py-1.5 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors">
            <Radio size={11} className="animate-pulse" /> Živá ukázka
          </button>
          <h3 className="font-heading font-light text-2xl lg:text-3xl text-white tracking-tight mb-2 max-w-lg">
            Mlžení naší brány GATE v reálném čase
          </h3>
          <p className="text-sm text-white/60 font-light max-w-md mb-5">
            Jemná mlhová clona bez mokrého povrchu — ideální jako vstupní prvek pro náměstí, parky i eventy.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setLightboxOpen(true)}
              className="inline-flex items-center gap-2 self-start px-5 py-2.5 bg-white/10 border border-white/30 text-white text-xs font-bold rounded-full hover:bg-white/20 transition-all">
              <Play size={13} fill="currentColor" /> Otevřít video
            </button>
            <Link to="/gate70" className="inline-flex items-center gap-2 self-start px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full hover:bg-white/90 transition-all">
              Poptat mlžnou bránu GATE <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <button onClick={() => setLightboxOpen(false)} aria-label="Zavřít"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              <X size={18} />
            </button>
            <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-black" onClick={(e) => e.stopPropagation()}>
              <video src={VIDEO_URL} controls autoPlay playsInline className="w-full max-h-[80vh]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}