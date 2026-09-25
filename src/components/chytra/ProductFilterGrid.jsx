import ProductExperience from '@/components/ui/ProductExperience';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductClick } from '@/lib/ga4';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

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
    <div className="ref-editorial-surface mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Celý katalog</p>
          <h2 className="max-w-[13ch] font-heading text-4xl font-semibold leading-[1.02] tracking-[-.045em] text-slate-950 lg:text-6xl">Vyberte si mlžítko podle prostoru.</h2>
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

      <div className="ref-progress-track mb-10"><motion.span className="ref-progress-line" initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }} /></div>

      {loading ?
      <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div> :

      <ProductExperience products={filtered}>
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) =>
        <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={p.slug ? `/produkt/${p.slug}` : '/kontakt'} onClick={() => trackProductClick(p.name, p.slug, 'chytra_mlzidla')}
            className="ref-product-card group flex h-full flex-col overflow-hidden bg-white/90">
                <ProductHoverImage product={p} className="ref-card-media aspect-[4/3] bg-slate-100" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4 flex items-center justify-between gap-3"><span className="ref-card-index font-mono text-[10px] font-bold text-cyan-700">{String(i + 1).padStart(2, "0")}</span><span className="truncate text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">{categories.find((c) => c.id === p.category_id)?.name || "MLŽIDLA"}</span></div>
                  <h3 className="mb-1 min-h-[2.6rem] line-clamp-2 font-heading text-xl font-semibold leading-snug tracking-[-.025em] text-slate-950">{p.name}</h3>
                  <p className="min-h-[2rem] text-xs text-slate-400 mb-3 line-clamp-2">{p.short_description}</p>
                  {p.coverage_area && <p className="-mt-2 mb-3 text-[11px] font-medium text-slate-500">Výška / dosah: {p.coverage_area}</p>}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs font-semibold text-slate-900">
                    <span>Detail produktu</span><span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition group-hover:border-cyan-300 group-hover:bg-cyan-50"><ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
        )}
          {filtered.length === 0 && <p className="col-span-4 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>}
        </div>
</ProductExperience>
      }
    </div>);

}