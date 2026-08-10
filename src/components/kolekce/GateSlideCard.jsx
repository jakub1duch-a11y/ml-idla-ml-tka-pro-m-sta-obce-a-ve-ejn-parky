import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GateSlideCard({ product, index }) {
  return (
    <div className="group relative shrink-0 w-[85vw] sm:w-[520px] lg:w-[620px] aspect-[4/5] sm:aspect-video rounded-[28px] overflow-hidden snap-start bg-slate-900 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/30">
      <img src={product.image_url} alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.055]" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      <div className="absolute top-5 left-5 flex gap-2"><span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-mono tracking-widest text-white/65 backdrop-blur-md">MLŽNÁ BRÁNA</span><span className="rounded-full bg-cyan-300 px-3 py-1.5 text-[9px] font-bold tracking-widest text-slate-950">{String(index + 1).padStart(2, '0')} / 07</span></div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="text-[10px] font-mono text-white/50 tracking-widest uppercase mb-2">{product.tagline}</p>
        <h3 className="font-heading font-light text-2xl sm:text-3xl text-white tracking-tight mb-3">
          {product.name}
        </h3>
        <p className="text-sm text-white/60 font-light max-w-md mb-5 line-clamp-2">{product.short_description}</p>
        <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-all shadow-lg">
          Vyžádat cenovou nabídku <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}