import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

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
    <section className="border-y border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mb-8 sm:mb-10">
          <p className="font-mono tracking-widest uppercase text-slate-400 mb-3 text-sm">NAŠE PRODUKTY</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-medium tracking-[-0.03em] text-slate-900 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] text-[clamp(2rem,8vw,2.4rem)] lg:text-3xl">
              Oblíbené instalace
            </motion.h2>
            <Link to="/mlzidla-mlzitka" className="btn-metallic-mist inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 sm:w-auto">Prohlédnout kolekce mlžítek

            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {products.map((product, i) =>
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.05, 0.18), duration: 0.42 }}
            className="w-[84%] shrink-0 snap-start sm:w-auto">
            
              <Link to={`/produkt/${product.slug}`}
            className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ProductHoverImage product={product} alt={product.name} fallback={product.image_url} className="h-full w-full" overlay />
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
                  <p className="text-slate-400 mt-0.5 font-light line-clamp-1 text-base">{product.short_description}</p>
                  }
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        




        
      </div>
    </section>);

}