import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CollectionProductGrid({ collection }) {
  const [products, setProducts] = useState([]);
  useEffect(() => { base44.entities.Product.list().then((items) => setProducts(items.filter((product) => collection.terms.some((term) => `${product.name} ${product.slug}`.toLowerCase().includes(term))).slice(0, 6))); }, [collection]);
  if (!products.length) return null;
  return <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20"><div className="flex items-end justify-between gap-5 mb-9"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Modely kolekce</p><h2 className="mt-3 font-heading text-4xl text-foreground">Vybrané produkty</h2></div><Link to="/mlzidla-mlzitka#catalog" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground">Celý katalog <ArrowRight size={16}/></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link key={product.id} to={`/produkt/${product.slug}`} className="group bg-card border border-[#b9c3c8]"><div className="aspect-[4/3] bg-muted overflow-hidden">{product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>}</div><div className="p-6"><h3 className="font-heading text-2xl text-foreground">{product.name}</h3><p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.short_description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">Detail produktu <ArrowRight size={15}/></span></div></Link>)}</div></section>;
}