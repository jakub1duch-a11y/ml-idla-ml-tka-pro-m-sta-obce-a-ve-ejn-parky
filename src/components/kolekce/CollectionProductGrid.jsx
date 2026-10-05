import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { normalizeProductMedia } from '@/lib/optimizedMedia';
import { isArchived } from '@/lib/newMedia';
import CatalogProductCard from './CatalogProductCard';

function orderProducts(items, collection) {
  const unique = [...new Map(items.filter((p) => !isArchived(p.slug)).map((p) => [p.slug, p])).values()];
  if (collection.includeAll) return unique.sort((a, b) => a.slug === collection.lastSlug ? 1 : b.slug === collection.lastSlug ? -1 : a.name.localeCompare(b.name, 'cs'));
  return (collection.productSlugs || []).map((slug) => unique.find((p) => p.slug === slug)).filter(Boolean);
}

export default function CollectionProductGrid({ collection }) {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    setProducts([]);
    base44.entities.Product.list('name', 200).then((items) => {
      if (!active) return;
      setProducts(orderProducts((items || []).map(normalizeProductMedia), collection));
      setState('ready');
    }).catch(() => { if (active) setState('error'); });
    return () => { active = false; };
  }, [collection, attempt]);

  return (
    <section id="collection-products" className="catalog-pattern relative mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-10 lg:py-20" aria-busy={state === 'loading'}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-[#d3deda] pb-7">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Vyberte svůj model</p>
          <h2 className="mt-3 font-heading text-3xl tracking-tight text-foreground sm:text-4xl">{collection.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Prohlédněte si design, fotografie a technické možnosti jednotlivých produktů.</p>
        </div>
        <Link to="/katalog-mlzitek" className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#0e5b67]">Celý katalog <ArrowRight size={16} /></Link>
      </div>
      {state === 'loading' && <p role="status" className="py-12 text-sm text-slate-600">Načítáme produkty…</p>}
      {state === 'error' && <div role="alert" className="rounded-xl border border-slate-200 p-6"><p>Produkty se nepodařilo načíst.</p><button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-11 rounded border border-[#0e5b67] px-5 text-sm font-semibold">Zkusit znovu</button></div>}
      {state === 'ready' && !products.length && <p className="py-8 text-slate-600">Aktuální nabídku této kolekce pro vás připravujeme. <Link to="/poptavka" className="underline">Pomůžeme vám s výběrem.</Link></p>}
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <CatalogProductCard key={product.id || product.slug} product={product} />)}
      </div>
    </section>
  );
}
