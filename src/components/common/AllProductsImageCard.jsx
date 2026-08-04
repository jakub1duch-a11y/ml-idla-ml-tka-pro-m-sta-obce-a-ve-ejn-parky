import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AllProductsImageCard({ to, image, compact = false, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`group relative block overflow-hidden rounded-2xl border border-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${compact ? 'h-36' : 'h-56 lg:h-72'}`}>
      <img src={image} alt="Všechny produkty" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-white/70 transition-colors duration-300 group-hover:bg-white/60" />
      <div className="absolute inset-0 flex items-center justify-center text-center p-">
        <div><p className={`${compact ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-heading font-extrabold text-primary`}>Všechny produkty</p><p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-secondary">Kompletní katalog MLŽIDLA® <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></p></div>
      </div>
    </Link>);

}