import React from 'react';
import { motion } from 'framer-motion';
import { ANCHOR_TECHNICAL } from '@/components/produkt/productVisuals';

export default function ProductTechnicalDetailSection() {
  const t = ANCHOR_TECHNICAL;
  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-accent">{t.eyebrow}</p>
          <h2 className="mt-4 font-heading text-3xl lg:text-4xl">{t.title}</h2>
          <p className="text-measure mt-5 leading-relaxed text-primary-foreground/75">{t.intro}</p>
          <dl className="mt-8 grid gap-px bg-white/15 sm:grid-cols-2">
            {t.facts.map(([label, value]) => (
              <div key={label} className="bg-primary p-4">
                <dt className="font-mono text-[10px] uppercase tracking-[.16em] text-primary-foreground/55">{label}</dt>
                <dd className="mt-1.5 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 overflow-hidden">
            <img src={t.secondaryImage} alt={t.secondaryAlt} className="h-48 w-full object-cover sm:h-60" loading="lazy" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/5 p-3">
          <img src={t.image} alt={t.alt} className="w-full object-contain" loading="lazy" />
        </motion.div>
      </div>
    </section>
  );
}