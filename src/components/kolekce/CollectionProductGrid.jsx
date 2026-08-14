import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

const orderProducts = (items, collection) => {
  if (collection.includeAll) return [...items].sort((a, b) => a.slug === collection.lastSlug ? 1 : b.slug === collection.lastSlug ? -1 : a.name.localeCompare(b.name, 'cs'));
  return collection.productSlugs.map((slug) => items.find((item) => item.slug === slug)).filter(Boolean);
};

export default function CollectionProductGrid({ collection }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {setProducts([]);base44.entities.Product.list().then((items) => setProducts(orderProducts(items, collection)));}, [collection]);
  if (!products.length) return null;
  return <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10"><div className="mb-10 flex items-end justify-between gap-5"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Modely kolekce</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">{collection.name}</h2></div><Link to="/mlzidla-mlzitka" className="btn-secondary-outline hidden rounded-full px-6 py-3 text-sm font-semibold text-foreground sm:inline-flex">Celý katalog <ArrowRight size={15} /></Link></div><div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => { const hoverImage = product.gallery_urls?.find((url) => url && url !== product.image_url); return <Link key={product.id} to={`/produkt/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl"><ProductHoverImage product={product} className="aspect-[4/3] bg-muted" /><div className="flex flex-1 flex-col p-6"><h3 className="min-h-[3.6rem] line-clamp-2 font-heading text-2xl leading-[1.2] text-foreground">{product.name}</h3><p className="mt-3 min-h-[2.75rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p><span className="btn-secondary-outline mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-colors group-hover:border-secondary group-hover:text-secondary">Detail produktu <ArrowRight size={15} /></span></div></Link>; })}</div><div className="mt-7 sm:hidden"><Link to="/mlzidla-mlzitka" className="btn-secondary-outline inline-flex rounded-full px-6 py-3 text-sm font-semibold text-foreground">Celý katalog <ArrowRight size={15} /></Link></div></section>;
}