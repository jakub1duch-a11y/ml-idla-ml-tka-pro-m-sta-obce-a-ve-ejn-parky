import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { val: '120+', label: 'Realizací v ČR a SR' },
  { val: '−9 °C', label: 'Max. ochlazení vzduchu' },
  { val: '100%', label: 'Bez chemie' },
  { val: '5 let', label: 'Záruka na konstrukci' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-ink">
      {/* Background video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
        <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f17970686_video_20260619_162927.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-8 pb-24 pt-32 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-5">ARCHITEKTURA ATMOSFÉRY</p>

          <h1 className="font-heading font-extralight text-6xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-3">
            OSTEV
          </h1>
          <h2 className="font-heading font-extralight text-5xl lg:text-7xl text-white/60 italic leading-[1.0] tracking-tight mb-6">
            Mlžný strom.
          </h2>
          <p className="text-white/55 text-lg leading-relaxed mb-8 max-w-lg">
            Skulptura ve tvaru stromu s integrovaným mlžením. Pro náměstí, eventy a městské prostory. Zakázková výroba.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/kolekce"
              className="flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              Prozkoumat OSTEV <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
              <Play size={14} className="fill-current" /> Sledovat video
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-mono text-green-400 tracking-widest uppercase">
            🌳 NOVÝ PRODUKT
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl">
          {stats.map((s) => (
            <div key={s.val} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="font-heading font-light text-2xl text-cyan leading-none mb-1">{s.val}</p>
              <p className="text-xs text-white/40 font-mono leading-tight">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}