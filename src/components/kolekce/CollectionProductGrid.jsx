import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const orderProducts = (items, collection) => {
  if (collection.includeAll) return [...items].sort((a, b) => a.slug === collection.lastSlug ? 1 : b.slug === collection.lastSlug ? -1 : a.name.localeCompare(b.name, 'cs'));
  return collection.productSlugs.map((slug) => items.find((item) => item.slug === slug)).filter(Boolean);
};

export default function CollectionProductGrid({ collection }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {setProducts([]);base44.entities.Product.list().then((items) => setProducts(orderProducts(items, collection)));}, [collection]);
  if (!products.length) return null;
  return <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10"><div className="mb-9 flex items-end justify-between gap-5"><div><p className="font-mono tracking-[.18em] uppercase text-secondary text-sm">MODELY KOLEKCE</p><h2 className="mt-3 font-heading text-4xl text-foreground">{collection.name}</h2></div><Link to="/mlzidla-mlzitka#catalog" className="hidden items-center gap-2 text-sm font-semibold text-foreground sm:inline-flex">Celý katalog <ArrowRight size={16} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link key={product.id} to={`/produkt/${product.slug}`} className="group border border-border bg-card"><div className="aspect-[4/3] overflow-hidden bg-muted">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}</div><div className="p-6"><h3 className="font-heading text-2xl text-foreground">{product.name}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1f838e]">Detail produktu</span></div></Link>)}</div></section>;
}