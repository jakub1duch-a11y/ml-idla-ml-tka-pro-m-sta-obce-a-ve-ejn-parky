import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function DarkFinalCta({ product }) {
  return (
    <section className="min-h-[70vh] w-full bg-black flex flex-col items-center justify-center px-6 py-20 text-center">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-heading font-bold text-white tracking-tight mb-6" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
        {product.name}. Nyní k mání.
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/poptavka" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">
          Nezávazná poptávka <ArrowRight size={15} />
        </Link>
        <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/25 text-white text-sm font-semibold rounded-full hover:border-white/60 transition-colors">
          Zpět na kolekci
        </Link>
      </div>
    </section>
  );
}