import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

export default function GateSlideCard({ product, index }) {
  return (
    <div className="group relative shrink-0 w-[85vw] sm:w-[520px] lg:w-[620px] aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden snap-start bg-slate-900">
      <ProductHoverImage product={product} className="absolute inset-0 h-full w-full" overlay />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      <span className="absolute top-5 right-5 font-mono text-white/20 text-3xl font-black">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mb-2">MLŽNÁ BRÁNA · MLŽIDLA®</p>
        <h3 className="font-heading font-light text-2xl sm:text-3xl text-white tracking-tight mb-3">
          {product.name}
        </h3>
        <p className="text-sm text-white/60 font-light max-w-md mb-5 line-clamp-2">{product.short_description}</p>
        <div className="flex flex-wrap gap-2.5">
          <Link to={`/produkt/${product.slug}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white btn-metallic-mist">
            Prohlédnout produkt <ArrowRight size={13} />
          </Link>
          <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`}
          className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white/90">
            Poptat řešení
          </Link>
        </div>
      </div>
    </div>);

}