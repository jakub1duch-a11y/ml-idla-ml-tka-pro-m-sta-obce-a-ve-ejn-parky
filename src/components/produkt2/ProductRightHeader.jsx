import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductRightHeader({ product, categoryName }) {
  return (
    <div className="p-8 lg:p-14 border-b border-white/10">
      <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">[{categoryName || 'Produkt'}]</p>
      <h1 className="font-mono font-bold uppercase leading-[0.95] text-white break-words" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
        {product.name}
      </h1>
      {product.short_description &&
        <p className="font-mono text-sm text-white/50 mt-5">[{product.short_description}]</p>
      }
      {product.description &&
        <p className="text-white/60 text-sm mt-4 max-w-lg leading-relaxed">{product.description}</p>
      }
      <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-techblue/15 border border-techblue text-techblue font-mono text-xs uppercase tracking-widest hover:bg-techblue hover:text-ink transition-all">
        Poptat produkt <ArrowRight size={14} />
      </Link>
    </div>
  );
}