import React from 'react';
import { motion } from 'framer-motion';
import { LINEA_VISUALS, LINEA_VIDEO } from '@/components/produkt/productVisuals';

export default function LineaGallery() {
  const [detail, plaza, install] = LINEA_VISUALS.cards;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">LINEA v provozu</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Fotografie a video z reálného mlžení.</h2>
        </motion.div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden bg-primary lg:col-span-2">
            <video src={LINEA_VIDEO} poster={plaza.image} autoPlay muted loop playsInline className="h-[280px] w-full object-cover sm:h-[420px] lg:h-full" aria-label="Video mlžítka LINEA v provozu" />
          </motion.div>
          <div className="grid gap-5">
            {[plaza, detail].map((card) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden">
                <img src={card.image} alt={card.alt} className="h-[220px] w-full object-cover" loading="lazy" />
                <p className="absolute bottom-0 left-0 right-0 bg-primary/85 px-4 py-2.5 text-xs font-semibold uppercase tracking-[.1em] text-primary-foreground">{card.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5 grid gap-5 border border-border bg-card p-6 sm:grid-cols-[1fr_1.4fr] sm:p-0">
          <img src={install.image} alt={install.alt} className="h-[220px] w-full object-cover sm:h-full" loading="lazy" />
          <div className="sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[.16em] text-secondary">Instalace</p>
            <h3 className="mt-2 font-heading text-2xl text-foreground">{install.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{install.desc}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}