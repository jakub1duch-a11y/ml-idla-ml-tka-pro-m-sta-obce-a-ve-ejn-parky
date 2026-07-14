import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function DarkHero({ product, materials }) {
  const [active, setActive] = useState(0);

  return (
    <section className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="font-heading font-bold text-white tracking-tight leading-[0.95]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
          {product.name}
        </h1>
        {product.short_description &&
          <p className="text-white/50 text-base sm:text-lg mt-5 max-w-xl mx-auto">{product.short_description}</p>
        }
      </motion.div>

      {product.image_url &&
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }}
          className="w-full max-w-3xl mt-10">
          <img src={product.image_url} alt={product.name} className="w-full h-auto object-contain max-h-[55vh] mx-auto" />
        </motion.div>
      }

      {materials.length > 1 &&
        <div className="flex items-center gap-3 mt-10">
          {materials.map((m, i) => (
            <button key={m} onClick={() => setActive(i)} aria-label={m}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${i === active ? 'bg-white text-black border-white' : 'border-white/20 text-white/60 hover:border-white/50'}`}>
              {m}
            </button>
          ))}
        </div>
      }

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">
          Poptat <ArrowRight size={15} />
        </Link>
        <a href="#specifikace" className="inline-flex items-center gap-2 px-7 py-3 border border-white/25 text-white text-sm font-semibold rounded-full hover:border-white/60 transition-colors">
          Specifikace
        </a>
      </div>
    </section>
  );
}