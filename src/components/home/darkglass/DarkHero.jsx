import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DarkFeatureBadges from '@/components/home/darkglass/DarkFeatureBadges';

const BG_IMAGE = 'https://images.unsplash.com/photo-1471874276116-3695af0114fd?w=1600&q=80';

export default function DarkHero() {
  return (
    <section className="relative min-h-[100svh] bg-slate-950 pt-20 overflow-hidden">
      <img src={BG_IMAGE} alt="Mlžný systém ve městě" className="absolute inset-0 w-full h-full object-cover opacity-70" loading="eager" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950" />

      <div className="relative max-w-2xl mx-6 sm:mx-10 lg:mx-16 pt-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="p-7 sm:p-9 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10">
          <p className="text-xs tracking-[0.25em] uppercase text-cyan mb-4">Veřejné a komerční prostory</p>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-5 uppercase">
            Mlžné systémy pro města, parky a komerční plochy
          </h1>
          <p className="text-white/70 leading-relaxed mb-7 text-sm sm:text-base">
            Ochlazení náměstí, hřišť a event prostor až o 10 °C. Nízkotlaká technologie 2–7 BAR, certifikace ČSN EN 1176.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-8">
            <Link to="/poptavka" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-slate-950 text-sm font-bold rounded-full hover:bg-cyan/90 transition-colors">
              Poptat systém <ArrowRight size={15} />
            </Link>
            <Link to="/kategorie/mesta-obce" className="text-sm text-white/80 hover:text-white font-medium underline underline-offset-4 transition-colors">
              Katalog: města a obce
            </Link>
          </div>
          <DarkFeatureBadges />
        </motion.div>
      </div>
    </section>);
}