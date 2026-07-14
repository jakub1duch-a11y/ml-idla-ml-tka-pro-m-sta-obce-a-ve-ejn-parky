import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BoldContact() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-heading font-black uppercase text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Chcete mlhoviště<br />ve vašem prostoru?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Kontaktujte nás a navrhneme řešení přesně pro váš prostor. Konzultace zdarma.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/kontakt" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-sm font-black uppercase tracking-wide hover:bg-red-600 transition-colors">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
          <Link to="/jak-to-funguje" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black text-slate-900 text-sm font-black uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
            Kalkulačka nákladů
          </Link>
        </div>
      </div>
    </section>);
}