import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function RelatedBackSlide({ related }) {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-8 lg:px-20 py-24 bg-ink">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-mono text-xs tracking-widest uppercase text-white/40 mb-4">[Mohlo by vás zajímat]</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-mono font-bold uppercase text-white mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Podobné produkty
      </motion.h2>
      {related.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mb-14">
          {related.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={`/produkt2/${r.slug}`} className="group block border border-white/10 hover:border-techblue/60 transition-all">
                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  {r.image_url && <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{r.name}</span>
                  <ArrowRight size={14} className="text-white/30 group-hover:text-techblue transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-white/30 text-sm font-mono mb-14">[Žádné podobné produkty]</p>
      )}
      <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Zpět na celou kolekci
      </Link>
    </section>
  );
}