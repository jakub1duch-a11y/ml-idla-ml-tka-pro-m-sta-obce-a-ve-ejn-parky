import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { USE_CASE_GALLERY } from '@/components/produkt/productVisuals';

export default function ProductUseCaseGallery({ onOpenLightbox }) {
  const images = USE_CASE_GALLERY.map((item) => item.image);
  return (
    <section className="border-t border-border bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Galerie použití</p>
            <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Kde mlžítka reálně chladí.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Náměstí, promenády, hřiště, koupaliště i sportoviště — stejná technologie, jiné rozmístění a výška.</p>
          </div>
          <Link to="/reference" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary">Všechny reference <ArrowRight size={15} /></Link>
        </motion.div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASE_GALLERY.map((item, index) => (
            <motion.button key={item.title} type="button" onClick={() => onOpenLightbox?.(index, images)}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}
              className="group relative overflow-hidden text-left">
              <img src={item.image} alt={item.alt} className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent px-4 pb-3 pt-10 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground">{item.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}