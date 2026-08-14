import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SmartCTA() {
  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-white tracking-tight mb-4">
            Připraveni na chytré mlžení?
          </h2>
          <p className="text-white/50 mb-8">Navrhneme variantu START, SMART nebo SMART PRO podle počtu mlžítek, zón, senzorů a požadované úrovně vzdálené správy.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/kontakt?produkt=Smart%20ovl%C3%A1d%C3%A1n%C3%AD"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">
              Poptat smart ovládání <ArrowRight size={16} />
            </Link>
            <Link to="/mlzidla-mlzitka" className="text-white/50 hover:text-white text-sm transition-colors">
              Zobrazit mlžítka →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>);

}