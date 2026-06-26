import React from 'react';
import { motion } from 'framer-motion';

const HERO_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f43d67a92_generated_8335d390.png";

export default function HeroSection() {
  const scrollToContact = () => {
    const el = document.getElementById('kontakt');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog-preview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Urban mist cooling system in a modern plaza"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tectonic/90 via-tectonic/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-24 pt-40 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-hydro text-sm font-mono tracking-widest uppercase mb-6">
            Mlžné systémy pro městské prostory
          </p>

          <div className="max-w-4xl">
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-heading font-light leading-tight tracking-tight">
              RECLAIMING
            </h1>
            <div className="flex items-center gap-6 my-4">
              <div className="flex-1 h-px bg-hydro/50" />
            </div>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-heading font-light leading-tight tracking-tight text-right lg:text-left lg:pl-32">
              THE URBAN CLIMATE
            </h1>
          </div>

          <p className="mt-8 text-white/60 text-base lg:text-lg max-w-xl leading-relaxed">
            Profesionální high-pressure mlžné systémy pro ochlazování veřejných prostorů, 
            průmyslových hal a rezidenčních teras.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 bg-hydro text-white text-sm font-medium tracking-wider uppercase hover:bg-hydro/90 transition-all"
            >
              Poptat Projekt
            </button>
            <button
              onClick={scrollToCatalog}
              className="px-8 py-4 border border-white/30 text-white text-sm font-medium tracking-wider uppercase hover:border-white/60 transition-all"
            >
              Prozkoumat Katalog
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40" />
      </motion.div>
    </section>
  );
}