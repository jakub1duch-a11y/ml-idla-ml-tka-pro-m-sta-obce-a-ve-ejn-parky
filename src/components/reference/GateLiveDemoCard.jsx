import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Radio } from 'lucide-react';

export default function GateLiveDemoCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 sm:mb-16">
      <Link to="/gate70" className="group relative block rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all min-h-[280px]">
        <video
          src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/42cf4b972_Efektmlhy-mlznabrana-zivynahled.mov"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        <div className="relative flex flex-col justify-end min-h-[280px] p-7 lg:p-9">
          <span className="inline-flex items-center gap-1.5 self-start mb-4 text-[10px] font-mono text-white tracking-widest uppercase px-3 py-1.5 bg-red-500/90 rounded-full">
            <Radio size={11} className="animate-pulse" /> Živá ukázka
          </span>
          <h3 className="font-heading font-light text-2xl lg:text-3xl text-white tracking-tight mb-2 max-w-lg">
            Mlžení naší brány GATE v reálném čase
          </h3>
          <p className="text-sm text-white/60 font-light max-w-md mb-5">
            Jemná mlhová clona bez mokrého povrchu — ideální jako vstupní prvek pro náměstí, parky i eventy.
          </p>
          <span className="inline-flex items-center gap-2 self-start px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full group-hover:bg-white/90 transition-all">
            Poptat mlžnou bránu GATE <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}