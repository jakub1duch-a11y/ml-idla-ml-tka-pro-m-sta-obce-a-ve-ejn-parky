import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const IMG = 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1000&auto=format&fit=crop';

export default function ProductsFeatureSection6() {
  return (
    <section className="bg-white py-24 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10">
          <div>
            <p className="text-sm font-semibold text-violet-600 mb-4">Produkty</p>
            <h2 className="font-heading font-light text-slate-900 tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Nekonečné možnosti<br />mlžení začínají zde.
            </h2>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden aspect-[16/10]">
            <img src={IMG} alt="Mlžný systém" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link to="/kategorie/komercni" className="group rounded-2xl border border-slate-200 p-7 hover:border-slate-300 transition-colors">
            <p className="font-heading font-medium text-lg text-slate-900 mb-2">Pro firmy a eventy</p>
            <p className="text-sm text-slate-500">Řešení pro gastro provozy, eventy a veřejné prostory.</p>
          </Link>
          <Link to="/servis-udrzba" className="group rounded-2xl border border-slate-200 p-7 hover:border-slate-300 transition-colors">
            <p className="font-heading font-medium text-lg text-slate-900 mb-2">Instalace a servis</p>
            <p className="text-sm text-slate-500">Montáž na klíč, servis a pravidelná údržba.</p>
          </Link>
          <Link to="/mlzidla-mlzitka" className="group rounded-2xl bg-violet-600 p-7 flex flex-col justify-between hover:bg-violet-500 transition-colors">
            <p className="font-heading font-medium text-lg text-white mb-2">Zobrazit celou kolekci</p>
            <span className="inline-flex items-center gap-2 text-white text-sm font-semibold">
              Zjistit více <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}