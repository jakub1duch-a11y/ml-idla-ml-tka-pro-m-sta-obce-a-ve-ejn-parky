import React from 'react';
import { Link } from 'react-router-dom';

export default function MegaCollectionCard({ item, onNavigate }) {
  const imageClass = item.crop === 'garden'
    ? 'h-full w-full scale-125 object-cover object-[64%_54%] transition-transform duration-500 group-hover:scale-[1.3]'
    : 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';

  return (
    <Link to={item.path} onClick={onNavigate} className="group block rounded-2xl p-1.5 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
        <img src={item.image} alt={item.label} loading="lazy" className={imageClass} />
      </div>
      <div className="px-1.5 pb-1">
        <p className="mt-3 font-heading text-sm font-semibold text-slate-900 group-hover:text-secondary transition-colors">{item.label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{item.sub}</p>
      </div>
    </Link>
  );
}