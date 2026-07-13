import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function MlzidlaProduktBreadcrumb({ product }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
      <Link to="/" className="hover:text-slate-700 transition-colors">Domů</Link>
      <ChevronRight size={12} />
      <Link to="/mlzidla" className="hover:text-slate-700 transition-colors">Produkty</Link>
      <ChevronRight size={12} />
      <span>{product.categoryGroup}</span>
      <ChevronRight size={12} />
      <span className="text-slate-700 font-semibold">{product.name}</span>
    </div>
  );
}