import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function MlzidlaProduktRealizace({ product }) {
  const images = product.gallery;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold text-slate-900 tracking-widest uppercase">Realizace</p>
        <Link to="/reference" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:gap-2.5 transition-all">
          Zobrazit všechny realizace <ArrowRight size={13} />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={img + i} className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
            <img src={img} alt={`${product.name} realizace`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}