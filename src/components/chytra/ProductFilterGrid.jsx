import ProductExperience from '@/components/ui/ProductExperience';
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { preparePublicCatalogProducts } from '@/lib/publicCatalogProducts';
import { trackProductClick } from '@/lib/ga4';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

export default function ProductFilterGrid() {
  const reduced = useReducedMotion();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list().catch(() => []),
      base44.entities.ProductCategory.list().catch(() => []),
    ]).then(([prods, cats]) => {
      setProducts(preparePublicCatalogProducts(prods || []));
      setCategories(cats || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((product) => product.category_id === activeCategory);

  return (
    <section className="ref-editorial-surface mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Celý katalog</p>
          <h2 className="max-w-[13ch] font-heading text-4xl font-semibold leading-[1.02] tracking-[-.045em] text-slate-950 lg:text-6xl">Vyberte si mlžítko podle prostoru.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setActiveCategory('all')} className={"rounded-full border px-4 py-2 text-xs font-medium transition-all " + (activeCategory === 'all' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300')}>Vše</button>
          {categories.map((category) => (
            <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} className={"rounded-full border px-4 py-2 text-xs font-medium transition-all " + (activeCategory === category.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300')}>{category.name}</button>
          ))}
        </div>
      </div>

      <div className="ref-progress-track mb-10">
        <motion.span className="ref-progress-line" initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div>
      ) : (
        <ProductExperience products={filtered}>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                onProductClick={() => trackProductClick(product.name, product.slug, 'chytra_mlzidla')}
              />
            ))}
            {filtered.length === 0 && <p className="col-span-full py-16 text-center text-sm text-slate-400">Žádné produkty v této kategorii.</p>}
          </div>
        </ProductExperience>
      )}
    </section>
  );
}
