import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GateSlideCard({ product, index }) {
  return (
    <div className="group relative shrink-0 w-[85vw] sm:w-[520px] lg:w-[620px] aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden snap-start bg-slate-900">
      <img src={product.image_url} alt={product.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      <span className="absolute top-5 right-5 font-mono text-white/20 text-3xl font-black">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mb-2">{product.tagline}</p>
        <h3 className="font-heading font-light text-2xl sm:text-3xl text-white tracking-tight mb-3">
          {product.name}
        </h3>
        <p className="text-sm text-white/60 font-light max-w-md mb-5 line-clamp-2">{product.short_description}</p>
        <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold hover:bg-white/25 transition-all">
          Poptat mlžnou bránu <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}