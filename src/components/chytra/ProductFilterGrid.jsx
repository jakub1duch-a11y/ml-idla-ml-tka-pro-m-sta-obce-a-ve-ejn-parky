import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductClick } from '@/lib/ga4';

export default function ProductFilterGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
    base44.entities.Product.list().catch(() => []),
    base44.entities.ProductCategory.list().catch(() => [])]
    ).then(([prods, cats]) => {
      setProducts(prods || []);
      setCategories(cats || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all' ? products : products.filter((p) => p.category_id === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Celý katalog</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Vyberte si mlžítko podle prostoru.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeCategory === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            Vše
          </button>
          {categories.map((c) =>
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${activeCategory === c.id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
              {c.name}
            </button>
          )}
        </div>
      </div>

      {loading ?
      <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p, i) =>
        <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={p.slug ? `/produkt/${p.slug}` : '/kontakt'} onClick={() => trackProductClick(p.name, p.slug, 'chytra_mlzidla')}
            className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all h-full">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                </div>
                <div className="p-5">
                  <h3 className="text-slate-900 font-medium mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.short_description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-900 font-medium">
                    Detail produktu <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
        )}
          {filtered.length === 0 && <p className="col-span-4 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>}
        </div>
      }
    </div>);

}