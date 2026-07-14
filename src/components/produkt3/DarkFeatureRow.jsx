import React from 'react';
import { motion } from 'framer-motion';

export default function DarkFeatureRow({ tag, title, desc, image, reverse }) {
  return (
    <section className="min-h-[90vh] w-full bg-black flex items-center px-6 lg:px-16 py-20">
      <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:[direction:rtl]' : ''}`}>
        <div className="lg:[direction:ltr]">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sm font-semibold text-techblue mb-4">{tag}</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-heading font-bold text-white tracking-tight mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
            {title}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-white/50 text-base lg:text-lg leading-relaxed max-w-md">
            {desc}
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="lg:[direction:ltr] rounded-3xl overflow-hidden bg-white/5 aspect-square">
          {image && <img src={image} alt={title} className="w-full h-full object-cover" />}
        </motion.div>
      </div>
    </section>
  );
}