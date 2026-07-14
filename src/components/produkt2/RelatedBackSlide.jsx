import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function RelatedBackSlide({ related }) {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 py-24 bg-white">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold tracking-wide text-techblue mb-4">Mohlo by vás zajímat</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-heading font-light text-slate-900 mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Podobné produkty
      </motion.h2>
      {related.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mb-14">
          {related.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={`/produkt2/${r.slug}`} className="group block rounded-2xl border border-slate-200 hover:border-slate-300 overflow-hidden transition-colors">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {r.image_url && <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{r.name}</span>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-techblue transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-sm mb-14">Žádné podobné produkty</p>
      )}
      <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={14} /> Zpět na celou kolekci
      </Link>
    </section>
  );
}