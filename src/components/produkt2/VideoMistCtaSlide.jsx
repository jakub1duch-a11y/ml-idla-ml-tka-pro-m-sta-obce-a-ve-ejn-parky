import React from 'react';
import { motion } from 'framer-motion';
import MistFogEffect from '@/components/produkt/MistFogEffect';
import ProductContactForm from '@/components/produkt/ProductContactForm';

export default function VideoMistCtaSlide({ product }) {
  return (
    <section className="relative min-h-screen w-full py-24 px-8 lg:px-20 bg-gradient-to-b from-[#0d141d] to-slate-900 overflow-hidden">
      <MistFogEffect />
      <div className="relative max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-mono text-xs tracking-widest uppercase text-white/40 mb-4">[Video a poptávka]</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-mono font-bold uppercase text-white mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          Podívejte se v akci
        </motion.h2>
        {product.video_url ? (
          <motion.video initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            src={product.video_url} controls playsInline className="w-full aspect-video border border-white/15 mb-16" />
        ) : (
          <p className="text-white/40 text-sm font-mono mb-16">[Video zatím není k dispozici]</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-techblue mb-3">[Nezávazná poptávka]</p>
            <h3 className="text-white text-2xl font-heading font-light mb-4">Váš prostor si zaslouží<br /><span className="italic text-techblue">vlastní {product.name}.</span></h3>
            <p className="text-white/50 text-sm">Konzultace zdarma · 3D vizualizace do 48 h · Odpovídáme do 24 h</p>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden">
            <ProductContactForm productName={product.name} />
          </div>
        </div>
      </div>
    </section>
  );
}