import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list().
    then((items) => {
      const featured = (items || []).filter((p) => p.featured && p.image_url);
      setProducts(featured.length >= 3 ? featured.slice(0, 6) : (items || []).filter((p) => p.image_url).slice(0, 6));
    }).
    catch(() => setProducts([])).
    finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-20 bg-slate-50">
      <div className="flex justify-center"><Loader size={24} className="animate-spin text-slate-300" /></div>
    </section>);


  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="font-mono tracking-widest uppercase text-slate-400 mb-3 text-sm">NAŠE PRODUKTY</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight">
              Oblíbené instalace
            </motion.h2>
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 whitespace-nowrap">
              Prohlédnout kolekce mlžítek <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) =>
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}>
            
              <Link to={`/produkt/${product.slug}`}
            className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={product.image_url} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {product.featured &&
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
                      Oblíbené
                    </span>
                }
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-slate-900 font-medium group-hover:text-slate-600 transition-colors leading-tight text-2xl">{product.name}</h3>
                    {product.short_description &&
                  <p className="text-slate-400 mt-0.5 font-light line-clamp-1 text-sm">{product.short_description}</p>
                  }
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <Link to="/kontakt"
          className="btn-metallic-mist px-8 py-4 text-sm font-bold">
            ✦ Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>);

}