import React from 'react';
import { Link } from 'react-router-dom';

export default function AllProductsImageCard({ to, image, compact = false, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`group relative block overflow-hidden rounded-2xl border border-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${compact ? 'h-36' : 'h-56 lg:h-72'}`}>
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e3b9629f2_mlzidla-vizual__5_.webp" alt="Všechny produkty" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-white/70 transition-colors duration-300 group-hover:bg-white/60" />
      <div className="absolute inset-0 flex items-center justify-center text-center px-6 py-6">
        <div><p className={`${compact ? 'text-2xl' : ""} font-heading font-extrabold text-primary lg:text-2xl`}>Všechny produkty</p><p className="mt-2 inline-flex items-center gap-2 text-secondary text-base [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal">Kompletní katalog MLŽIDLA®</p></div>
      </div>
    </Link>);

}