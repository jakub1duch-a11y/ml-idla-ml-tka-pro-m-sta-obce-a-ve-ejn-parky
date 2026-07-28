import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EXCLUDED = ['Zemní vrut – rychlá mobilní instalace', 'SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky HT-LT', 'senzory'];

export default function Collection2026Section() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list()
      .then((items) => setProducts((items || []).filter((p) => p.image_url && !EXCLUDED.includes(p.name))))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section className="relative py-16 sm:py-24 bg-slate-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-white to-slate-950 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-white to-slate-950 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Kolekce 2026</p>
            <h2 className="font-heading font-light text-3xl lg:text-5xl text-white tracking-tight leading-[1.1]">
              Nabídka mlžítek pro budoucnost městského osvěžení
            </h2>
          </div>
          <div className="hidden sm:flex gap-2 shrink-0">
            <button onClick={() => scrollBy(-360)} aria-label="Předchozí"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => scrollBy(360)} aria-label="Další"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size={22} className="animate-spin text-white/30" />
          </div>
        ) : (
          <div ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {products.map((p, i) => (
              <Link key={p.id} to={p.slug ? `/produkt/${p.slug}` : '/kontakt'}
                className="group relative shrink-0 w-[75vw] sm:w-[320px] lg:w-[340px] aspect-[3/4] rounded-2xl overflow-hidden snap-start bg-white/5 border border-white/10">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <span className="absolute top-4 right-4 font-mono text-white/20 text-2xl font-black">{String(i + 1).padStart(2, '0')}</span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-heading font-light text-xl text-white tracking-tight mb-2 leading-snug">{p.name}</h3>
                  <p className="text-xs text-white/60 font-light line-clamp-2 mb-4">{p.short_description}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:gap-2.5 transition-all">
                    Detail produktu <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}