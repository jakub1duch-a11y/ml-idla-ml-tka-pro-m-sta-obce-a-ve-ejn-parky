import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export default function MlzidlaProduktInfo({ product }) {
  return (
    <div>
      <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">{product.category}</p>
      <h1 className="font-heading font-black text-4xl lg:text-5xl text-slate-900 tracking-tight leading-none mb-4">{product.name}</h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-2">{product.description}</p>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description2}</p>

      <div className="space-y-1 mb-7">
        {product.quickSpecs.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3 py-1.5">
              <span className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon size={15} className="text-blue-600" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">{s.label}</span>
                <span className="block text-xs text-slate-400">{s.value}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-3 rounded-full transition-colors">
          Poptat řešení <ArrowRight size={15} />
        </Link>
        <Link to="/ke-stazeni" className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 text-sm font-bold px-5 py-3 rounded-full hover:bg-slate-50 transition-colors">
          Technické parametry <FileText size={14} />
        </Link>
      </div>
    </div>
  );
}