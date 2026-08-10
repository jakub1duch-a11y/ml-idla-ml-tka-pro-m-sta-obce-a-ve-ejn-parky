import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Wind, Leaf } from 'lucide-react';

/**
 * PremiumHeroSection — Full-screen hero with video background, gradient overlay,
 * and premium typography. Designed for homepage prestige and conversion.
 * 
 * Optimizations:
 * - Lazy video load with preload="metadata"
 * - Gradient overlay for text readability (slate-900/95 → slate-900/30)
 * - Responsive text scaling with clamp()
 * - Motion animations with stagger for CTA and benefits
 * - Accessible color contrast (WCAG AA+)
 */

const STATS = [
  { icon: Zap, value: '−10°C', label: 'Ochlazení', color: 'text-cyan-400' },
  { icon: Leaf, value: '0%', label: 'Chemie', color: 'text-emerald-400' },
  { icon: Wind, value: '2–7 BAR', label: 'Tlak', color: 'text-sky-400' }
];

export default function PremiumHeroSection() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative min-h-[80vh] h-[100svh] overflow-hidden bg-slate-950 lg:min-h-[720px]">
      {/* Video background — optimized for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {!videoError ? (
          <video
            src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/cb467bdec_mlznesochyproobceamesta.mp4"
            alt="Mlžné sochy v městském prostředí"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          /* Fallback static image if video fails */
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/518c8c2a3_mlzitka-pro-mesta.jpg"
            alt="Mlžné sochy v městském prostředí"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Multi-layer gradient for text readability + premium aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/50 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
        
        {/* Subtle texture overlay for depth */}
        <div className="absolute inset-0 mix-blend-multiply opacity-40 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center lg:justify-between lg:pt-20 lg:pb-16">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Supertitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-cyan-300/80 font-semibold"
              >
                Ochlazení budoucnosti
              </motion.p>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-4xl font-heading font-semibold leading-[1.1] tracking-tight"
                style={{
                  fontSize: 'clamp(2.25rem, 8vw, 4.5rem)',
                  color: '#ffffff',
                  letterSpacing: '-0.04em'
                }}
              >
                Nerezová mlžítka z <span className="text-cyan-300">české výroby</span>,<br />
                která <span style={{ fontStyle: 'italic' }}>chladí bez čerpadla.</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-2xl text-base sm:text-lg leading-relaxed font-light text-white/85"
              >
                20 let průmyslové zkušenosti. Napojení přímo na vodovod. Smart řízení dle teploty a pohybu. Od návrhu přes instalaci až k celoživotnímu servisu — vše s českou kvalitou a pokorou.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link
                  to="/mlzidla-mlzitka"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold text-sm sm:text-base hover:shadow-2xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
                >
                  Prohlédnout produkty
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/poptavka"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold text-sm sm:text-base hover:border-white/70 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Vyžádat cenovou nabídku
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats/Benefits — sticky at bottom on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-8"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                  className="flex flex-col items-center sm:items-start gap-2 p-3 sm:p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <Icon size={20} className={`${stat.color} shrink-0`} />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white font-heading">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-white/70 font-light uppercase tracking-wide">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/40 text-xs font-mono hidden lg:block"
      >
        Posuňte dolů
      </motion.div>
    </section>
  );
}
