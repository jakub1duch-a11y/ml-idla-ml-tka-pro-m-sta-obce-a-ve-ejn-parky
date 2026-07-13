import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSlide({ product, categoryName, onScrollNext }) {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end">
      {product.image_url && <img src={product.image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-black/40 to-black/10" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative z-10 p-8 lg:p-16 max-w-3xl">
        <p className="font-mono text-xs tracking-widest uppercase text-techblue mb-3">[{categoryName || 'Produkt'}]</p>
        <h1 className="font-mono font-bold uppercase leading-[0.95] text-white break-words" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
          {product.name}
        </h1>
        {product.short_description &&
          <p className="font-mono text-sm text-white/60 mt-5 max-w-lg">[{product.short_description}]</p>
        }
      </motion.div>
      <button onClick={onScrollNext} className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors">
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}