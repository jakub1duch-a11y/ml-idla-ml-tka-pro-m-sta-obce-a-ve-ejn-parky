import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSlide({ product, categoryName, onScrollNext }) {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 pt-28 pb-16 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
        {categoryName && <p className="text-sm font-semibold tracking-wide text-techblue mb-4">{categoryName}</p>}
        <h1 className="font-heading font-light text-slate-900 leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
          {product.name}
        </h1>
        {product.short_description &&
          <p className="text-slate-500 text-lg mt-6 max-w-xl mx-auto">{product.short_description}</p>
        }
      </motion.div>

      {product.image_url &&
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}
          className="w-full max-w-4xl mt-12 rounded-3xl overflow-hidden bg-slate-100 aspect-[16/10]">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>
      }

      <button onClick={onScrollNext} className="absolute bottom-8 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
        <span className="text-[11px] tracking-widest uppercase">Zjistit více</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
}