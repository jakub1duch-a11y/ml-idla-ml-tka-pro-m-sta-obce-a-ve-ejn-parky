import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list()
      .then(items => {
        const featured = (items || []).filter(p => p.featured && p.image_url);
        setProducts(featured.length >= 3 ? featured.slice(0, 6) : (items || []).filter(p => p.image_url).slice(0, 6));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-20 bg-surface">
      <div className="flex justify-center"><Loader size={24} className="animate-spin text-cyan/40" /></div>
    </section>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-surface border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Naše produkty</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              Oblíbené instalace
            </h2>
            <Link to="/kolekce" className="flex items-center gap-2 text-sm text-cyan hover:text-cyan/80 transition-colors font-medium whitespace-nowrap">
              Celá kolekce <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/produkt/${product.slug}`}
                className="group block rounded-2xl overflow-hidden bg-card_bg border border-white/10 hover:border-cyan/40 transition-all duration-300 h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={product.image_url} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-cyan text-ink text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
                      Oblíbené
                    </span>
                  )}
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-white font-medium group-hover:text-cyan transition-colors leading-tight">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-xs text-white/35 mt-0.5 font-light line-clamp-1">{product.short_description}</p>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-white/25 group-hover:text-cyan transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/25">
            ✦ Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}