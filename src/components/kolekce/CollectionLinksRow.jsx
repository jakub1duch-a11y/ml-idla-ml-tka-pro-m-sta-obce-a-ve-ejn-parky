import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Trees, Waves, PartyPopper, Home, Store, ArrowRight } from 'lucide-react';

const LINKS = [
{ label: 'Města a obce', to: '/kategorie/mesta-obce', icon: Building2 },
{ label: 'Parky a hřiště', to: '/kategorie/parky-hriste', icon: Trees },
{ label: 'Koupaliště', to: '/kategorie/koupaliste', icon: Waves },
{ label: 'Eventy', to: '/kategorie/eventy', icon: PartyPopper },
{ label: 'Outdoor a zahrady', to: '/kategorie/outdoor-zahrady', icon: Home },
{ label: 'Komerční prostory', to: '/kategorie/komercni', icon: Store }];


export default function CollectionLinksRow() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-20">
      <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-xs font-mono tracking-widest uppercase mb-6 text-[hsl(var(--foreground))]">
        Procházet dle prostoru
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {LINKS.map((l, i) =>
        <motion.div key={l.to} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={l.to} className="group flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all h-full bg-[hsl(var(--accent))]">
              <l.icon size={18} className="text-slate-900" />
              <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                {l.label} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>);

}