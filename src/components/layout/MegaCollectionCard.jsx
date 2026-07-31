import React from 'react';
import { Link } from 'react-router-dom';

export default function MegaCollectionCard({ item, onNavigate }) {
  const imageClass = item.crop === 'garden'
    ? 'h-full w-full scale-125 object-cover object-[64%_54%] transition-transform duration-500 group-hover:scale-[1.3]'
    : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';

  return (
    <Link to={item.path} onClick={onNavigate} className="group block rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        <img src={item.image} alt={item.label} className={imageClass} />
      </div>
      <p className="mt-3 font-heading text-sm text-slate-900">{item.label}</p>
      <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
    </Link>
  );
}