import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HERO_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/772ce921e_video_20260622_153105.mp4';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-70">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      </div>

      {/* Top eyebrow */}
      <div className="absolute top-24 left-0 right-0 flex justify-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="font-mono text-[10px] tracking-widest uppercase text-white/40">
          HOLMTEC · MLŽNÉ SOCHY · NEREZOVÁ OCEL
        </motion.p>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <h1 className="text-white font-heading font-light text-5xl sm:text-6xl lg:text-8xl leading-none tracking-tight">
            Mlha jako zážitek.
            <br />
            <em className="not-italic text-white/40">Ocel jako socha.</em>
          </h1>
          <p className="mt-6 text-white/50 text-base lg:text-lg max-w-lg">
            Zakázkové mlžné sochy z nerezové oceli AISI 304. Umění, které ochlazuje.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/kolekce"
              className="px-8 py-4 bg-white text-ink text-xs font-mono tracking-widest uppercase hover:bg-white/90 transition-all">
              Prohlédnout kolekci
            </Link>
            <Link to="/jak-to-funguje"
              className="px-8 py-4 border border-white/30 text-white text-xs font-mono tracking-widest uppercase hover:border-white/60 transition-all">
              Jak to funguje
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-10">
          {[
            { val: '–10 °C', label: 'Ochlazení okolí' },
            { val: '5 μm', label: 'Velikost kapky' },
            { val: '< 10 l/h', label: 'Spotřeba vody' },
            { val: 'AISI 304', label: 'Nerezová ocel' },
          ].map(s => (
            <div key={s.val}>
              <p className="font-heading text-white text-2xl lg:text-3xl font-light">{s.val}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/30 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}