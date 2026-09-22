import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductCategoryExplorer() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    let cancelled = false;
    Promise.all([base44.entities.ProductCategory.list('order', 100), base44.entities.Product.list('name', 200)])
      .then(([cats, items]) => { if (!cancelled) { setCategories(cats || []); setProducts((items || []).filter(p => !p.slug?.startsWith('archived-'))); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  if (!categories.length) return null;
  return <section className="bg-[#f3f7f8] py-14 sm:py-20" aria-labelledby="category-explorer-title">
    <div className="mx-auto max-w-7xl px-5 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-800">Vyberte si řešení</p>
        <h2 id="category-explorer-title" className="mt-3 font-heading text-3xl tracking-tight text-slate-950 sm:text-4xl">Podle prostoru. Podle vašeho stylu.</h2></div>
        <Link to="/mlzidla-mlzitka#catalog" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-900">Všechny produkty <ArrowUpRight size={18}/></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => {
          const items = products.filter(p => p.category_id === category.id);
          const cover = category.image_url || items.find(p => p.image_url)?.image_url;
          const href = category.slug === 'smart-mlzitka' ? '/smart-ovladani' : '/mlzidla-mlzitka?kategorie=' + encodeURIComponent(category.slug) + '#catalog';
          return <Link key={category.id} to={href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-700">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              {cover ? <img src={cover} alt={category.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none"/> : <div className="flex h-full items-center justify-center"><Droplets size={44} className="text-cyan-800"/></div>}
              <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs text-slate-800">{category.slug === 'smart-mlzitka' ? 'Řízení a automatizace' : items.length ? items.length + ' produktů' : 'Řešení na míru'}</span>
            </div>
            <div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-xl font-semibold text-slate-950">{category.name}</h3><ArrowUpRight size={19} className="shrink-0 text-cyan-800"/></div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{category.description}</p></div>
          </Link>;
        })}
      </div>
    </div>
  </section>;
}
