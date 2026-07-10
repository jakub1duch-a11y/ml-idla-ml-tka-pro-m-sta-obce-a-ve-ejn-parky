import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SustainabilityCTA() {
  return (
    <section className="bg-slate-50 py-20 border-t border-slate-200">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
            Chcete ochladit svůj prostor udržitelně?
          </h2>
          <p className="text-slate-500 mb-8">Poradíme s návrhem řešení šetrného k vodě i městskému klimatu.</p>
          <Link to="/kontakt?produkt=Udr%C5%BEiteln%C3%A9%20ml%C5%BE%C3%ADt%C3%A1"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            Nezávazná konzultace <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>);

}