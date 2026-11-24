import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { preparePublicCatalogProducts } from '@/lib/publicCatalogProducts';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

export default function AllProductsCatalog({ categoryTitle = 'vybrané oblasti' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      base44.entities.Product.list().catch(() => []),
      base44.entities.ProductCategory.list().catch(() => []),
    ]).then(([productRows, categoryRows]) => {
      if (!active) return;
      setProducts(preparePublicCatalogProducts(productRows || []));
      setCategories(categoryRows || []);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('cs');
    const rows = products.filter((product) => {
      const matchesCategory = category === 'all' || String(product.category_id || '') === category;
      const haystack = [product.name, product.slug, product.short_description, product.description]
        .filter(Boolean).join(' ').toLocaleLowerCase('cs');
      return matchesCategory && (!needle || haystack.includes(needle));
    });
    if (sort === 'name') rows.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'cs'));
    if (sort === 'name-desc') rows.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'cs'));
    return rows;
  }, [products, query, category, sort]);

  return <section id="katalog-produktu" className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20" aria-labelledby="all-products-heading">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-700">Kompletní katalog MLŽIDLA®</p>
        <h2 id="all-products-heading" className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Všechny produkty pro {categoryTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Prohlédněte si kompletní nabídku a vyfiltrujte model podle názvu nebo produktové kategorie. Každá karta vede na detail konkrétního produktu.</p>
      </div>
      <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_minmax(180px,220px)]">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <Search size={17} className="shrink-0 text-slate-400" />
          <span className="sr-only">Hledat produkt</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hledat podle názvu nebo popisu…" className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
        </label>
        <label className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
          <SlidersHorizontal size={16} className="shrink-0 text-slate-400" />
          <span className="sr-only">Filtrovat podle kategorie</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-transparent text-sm text-slate-700 outline-none">
            <option value="all">Všechny produktové kategorie</option>
            {categories.map((item) => <option key={item.id} value={String(item.id)}>{item.name}</option>)}
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
          <ArrowUpDown size={16} className="shrink-0 text-slate-400" />
          <span className="sr-only">Řadit produkty</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full bg-transparent text-sm text-slate-700 outline-none">
            <option value="recommended">Doporučené pořadí</option>
            <option value="name">Název A–Z</option>
            <option value="name-desc">Název Z–A</option>
          </select>
        </label>
      </div>
      <p className="mb-5 text-sm text-slate-500" role="status" aria-live="polite">{loading ? 'Načítám katalog…' : `Zobrazeno ${visible.length} z ${products.length} produktů`}</p>
      {!loading && <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => <CatalogProductCard key={product.id || product.slug} product={product} />)}
        {visible.length === 0 && <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">Těmto filtrům neodpovídají žádné produkty. Změňte hledaný výraz nebo vyberte všechny kategorie.</p>}
      </div>}
    </div>
  </section>;
}
