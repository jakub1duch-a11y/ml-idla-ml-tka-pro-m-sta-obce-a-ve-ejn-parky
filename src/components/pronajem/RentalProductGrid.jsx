import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RentalProductGrid({ products }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-border bg-card"><div className="aspect-[4/3] overflow-hidden bg-muted">{product.image_url && <img src={product.image_url} alt={`${product.name} GO`} className="h-full w-full object-cover" loading="lazy"/>}</div><div className="p-6"><p className="font-mono text-[10px] tracking-[.16em] text-secondary">PRONÁJEM / GO</p><h3 className="mt-2 font-heading text-2xl text-foreground">{product.name} GO</h3><p className="mt-3 line-clamp-2 text-sm text-muted-foreground">Mobilní provedení připravené pro eventy, festivaly, letní večírky a rodinné dny.</p><Link to={`/pronajem?produkt=${encodeURIComponent(product.name)}#poptavka`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary">Poptat cenu pronájmu <ArrowRight size={15}/></Link></div></article>)}</div>;
}