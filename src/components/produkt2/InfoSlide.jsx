import React from 'react';
import { motion } from 'framer-motion';

export default function InfoSlide({ product }) {
  const gallery = product.gallery_urls || [];
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 py-24 bg-white">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold tracking-wide text-techblue mb-4">O produktu</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-heading font-light text-slate-900 mb-8" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Detail produktu
      </motion.h2>
      {product.description &&
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-2xl mb-10">
          {product.description}
        </motion.p>
      }
      {gallery.length > 0 &&
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
          {gallery.map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
              <img src={g} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      }
    </section>
  );
}