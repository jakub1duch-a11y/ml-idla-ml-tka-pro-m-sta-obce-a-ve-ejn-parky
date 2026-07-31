import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GoIcon from '@/components/pronajem/GoIcon';

const rentalOrder = (product) => {
  if (product.slug === 'mlzna-brana-gate') return 0;
  if (product.slug === 'bendy-brana') return 1;
  if (product.slug === 'mlzici-tryska') return 2;
  return 3;
};

export default function RentalProductGrid({ products }) {
  const sortedProducts = [...products].sort((a, b) => rentalOrder(a) - rentalOrder(b));
  return <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">{sortedProducts.map((product) => {
    const displayName = product.name.replace(/\s+GO$/i, '');
    return <article key={product.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">{product.image_url && <img src={product.image_url} alt={displayName} className="h-full w-full object-cover" loading="lazy"/>}<GoIcon /></div>
      <div className="p-6"><p className="font-mono text-[10px] tracking-[.16em] text-secondary">PRONÁJEM</p><h3 className="mt-2 font-heading text-2xl text-foreground">{displayName}</h3><p className="mt-3 line-clamp-2 text-sm text-muted-foreground">Mobilní provedení připravené pro eventy, festivaly, letní večírky a rodinné dny.</p><Link to={`/pronajem?produkt=${encodeURIComponent(product.name)}#poptavka`} className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-secondary transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:shadow-md">Poptat cenu pronájmu <ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/></Link></div>
    </article>;
  })}</div>;
}