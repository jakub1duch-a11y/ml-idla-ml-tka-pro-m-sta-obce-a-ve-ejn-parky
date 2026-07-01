import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductsSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list()
      .then(items => {
        setProducts((items || []).filter(p => p.image_url).slice(0, 10));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  if (loading) return (
    <section className="py-20 bg-white">
      <div className="flex justify-center"><Loader size={24} className="animate-spin text-slate-300" /></div>
    </section>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Náš katalog</p>
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight">
              Prohlédněte si produkty
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} aria-label="Předchozí"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Další"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Slider */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <Link key={product.id} to={`/produkt/${product.slug}`}
              className="group shrink-0 w-72 snap-start block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={product.image_url} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
                    Oblíbené
                  </span>
                )}
              </div>
              <div className="p-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-slate-900 font-medium group-hover:text-slate-600 transition-colors leading-tight">{product.name}</h3>
                  {product.short_description && (
                    <p className="text-xs text-slate-400 mt-0.5 font-light line-clamp-1">{product.short_description}</p>
                  )}
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}