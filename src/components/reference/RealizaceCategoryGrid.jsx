import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby, ArrowRight } from 'lucide-react';

const CATEGORY_PAGES = [
  { icon: Building2, label: 'Města a obce', path: '/kategorie/mesta-obce', color: 'text-slate-600' },
  { icon: Trees, label: 'Parky a hřiště', path: '/kategorie/parky-hriste', color: 'text-emerald-500' },
  { icon: Waves, label: 'Koupaliště a aquaparky', path: '/kategorie/koupaliste', color: 'text-blue-500' },
  { icon: Flower2, label: 'Outdoor a zahrady', path: '/kategorie/outdoor-zahrady', color: 'text-green-500' },
  { icon: Sparkles, label: 'Art instalace na míru', path: '/kategorie/art-instalace', color: 'text-fuchsia-500' },
  { icon: Baby, label: 'Školy a školky', path: '/kategorie/skoly-skolky-deti', color: 'text-sky-500' },
  { icon: Palette, label: 'Pro architekty', path: '/kategorie/architekti', color: 'text-violet-500' },
  { icon: Factory, label: 'Komerční prostory', path: '/kategorie/komercni', color: 'text-amber-500' },
  { icon: Tent, label: 'Eventy a festivaly', path: '/kategorie/eventy', color: 'text-rose-500' },
];

export default function RealizaceCategoryGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 border-t border-slate-200">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Podle využití</p>
        <h2 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 tracking-tight">Realizace podle typu prostoru</h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CATEGORY_PAGES.map((link, i) => (
          <motion.div key={link.path} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={link.path}
              className="group flex items-center gap-3 px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <link.icon size={18} className={`${link.color} shrink-0`} />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-light">{link.label}</span>
              <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-600 transition-colors" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}