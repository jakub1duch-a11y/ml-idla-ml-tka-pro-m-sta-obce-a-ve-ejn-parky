import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

export default function CategoryProductCard({ product }) {
  return <Link to={`/produkt/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl">
    <ProductHoverImage product={product} className="aspect-[4/3] bg-muted" />
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <h3 className="min-h-[3.2rem] line-clamp-2 font-heading text-xl leading-[1.2] text-foreground sm:text-2xl">{product.name}</h3>
      {product.short_description && <p className="mt-3 min-h-[2.75rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>}
      <span className="btn-secondary-outline mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground">Detail produktu <ArrowRight size={15}/></span>
    </div>
  </Link>;
}
