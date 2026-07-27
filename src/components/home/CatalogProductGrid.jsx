import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CatalogProductGrid({ products, loading }) {
  return <section className="bg-secondary py-20 sm:py-28">
    <div className="site-container">
      <p className="content-eyebrow">Vybrané modely</p>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4"><h2 className="m-0 text-4xl [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">Produkty, které mění klima místa</h2><Link to="/katalog" className="text-sm font-bold text-primary hover:underline">Zobrazit vše</Link></div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(loading ? Array.from({ length: 3 }) : products).map((product, index) => loading ? <div key={index} className="h-96 animate-pulse rounded-lg bg-card" /> : <Link key={product.id} to={`/produkt/${product.slug}`} className="group overflow-hidden rounded-lg bg-card">
          <div className="aspect-[4/3] overflow-hidden bg-muted"><img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
          <div className="p-6"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-primary">{product.micron_size || 'Mlžný systém'}</p><h3 className="m-0 text-2xl">{product.name}</h3><p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Detail produktu <ArrowRight size={16} /></span></div>
        </Link>)}
      </div>
    </div>
  </section>;
}