import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function MinimalContact() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-heading font-extralight text-3xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Chcete mlhoviště<br />ve vašem prostoru?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Kontaktujte nás a navrhneme řešení přesně pro váš prostor. Konzultace zdarma.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/kontakt" className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
          <Link to="/jak-to-funguje" className="inline-flex items-center gap-2 px-8 py-3.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-full hover:border-slate-500 transition-colors">
            Kalkulačka nákladů
          </Link>
        </div>
      </div>
    </section>);
}