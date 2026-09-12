import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Gauge, Droplets } from 'lucide-react';
import ProductHoverImage from '@/components/ui/ProductHoverImage';
import { getLine, getFamily } from '@/lib/productFamilies';

export default function CatalogProductCard({ product }) {
  const line = getLine(product);
  const family = getFamily(product);
  const specs = [
    product.material && [ShieldCheck, product.material.includes('316') ? 'Nerez AISI 316L' : product.material.includes('304') ? 'Nerez AISI 304' : product.material],
    product.pressure && [Gauge, product.pressure],
    product.water_consumption && [Droplets, product.water_consumption],
  ].filter(Boolean).slice(0, 2);

  return (
    <article className="card-brand-product flex h-full flex-col">
      <Link to={`/produkt/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#E7F4F8]">
        <ProductHoverImage product={product} className="h-full w-full" />
        <span className="badge-brand-primary absolute left-4 top-4">{line.label}</span>
        {product.featured && <span className="absolute right-4 top-4 bg-[#22D3EE] px-2.5 py-1 font-mono text-[10px] tracking-[.14em] text-[#0A1628]">VÝBĚR</span>}
      </Link>
      <div className="body flex flex-1 flex-col">
        <div className="eyebrow">{family.label}</div>
        <h3 className="!text-[#0A1628]"><Link to={`/produkt/${product.slug}`}>{product.name}</Link></h3>
        <p className="line-clamp-2">{product.short_description}</p>
        {specs.length > 0 && (
          <ul className="mb-4 space-y-1.5 border-t border-[#D3E2E8] pt-4 text-[12.5px] text-[#5A6B78]">
            {specs.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2"><Icon size={14} strokeWidth={1.5} className="shrink-0 text-[#153863]" /><span className="truncate">{text}</span></li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <Link to={`/produkt/${product.slug}`} className="cta">Detail produktu →</Link>
          <Link to={`/poptavka?produkt=${product.slug}`} className="btn-brand-accent-link !p-0">Získat návrh a cenu <ArrowRight size={14} /></Link>
        </div>
      </div>
    </article>
  );
}