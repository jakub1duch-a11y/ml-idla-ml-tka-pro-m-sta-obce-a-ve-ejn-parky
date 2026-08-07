import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RelatedProductCard({ product, index }) {
  const isNozzle = product.slug === 'mlzici-tryska';
  return (
    <Link to={`/produkt/${product.slug}`} className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        {isNozzle && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold text-accent-foreground">STANDARD M2</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><h3 className="font-heading text-lg text-slate-900">{product.name}</h3><ArrowRight size={16} className="mt-1 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-secondary" /></div>
        {product.short_description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{product.short_description}</p>}
        {isNozzle && <div className="border-t border-slate-100"><p className="text-[10px] font-bold uppercase tracking-widest text-secondary hidden">Varianty</p><div className="mt-2 flex gap-2 hidden">{['M1', 'M2 · standard', 'M3'].map((item) => <span key={item} className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.startsWith('M2') ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-slate-500'}`}>{item}</span>)}</div><p className="mt-3 text-[11px] text-slate-500">{product.pressure} · {product.water_consumption}</p></div>}
      </div>
    </Link>);

}