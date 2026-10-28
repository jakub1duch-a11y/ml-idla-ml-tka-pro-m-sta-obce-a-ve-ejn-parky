import React from 'react';
import { Link } from 'react-router-dom';
import ProductMenuGroups from '@/components/layout/ProductMenuGroups';

export default function MegaCatalogMenu({ open, onEnter, onLeave, onNavigate, collections }) {
  if (!open) return null;
  return (
    <nav id="desktop-products-menu" aria-label="Produkty a kolekce" onMouseEnter={onEnter} onMouseLeave={onLeave} className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-var(--site-header-height))] overflow-y-auto border-b border-border bg-card text-card-foreground shadow-xl">
      <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div><p className="text-sm text-muted-foreground">Produkty MLŽIDLA.CZ</p><h2 className="mt-1 font-heading text-2xl text-primary">Modely, sestavy a technika</h2></div>
          <Link to="/katalog-mlzitek" onClick={onNavigate} className="btn-brand-accent-link">Kompletní katalog →</Link>
        </div>
        <ProductMenuGroups onNavigate={onNavigate} />
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-4">
          {collections.filter((item) => !item.featured).map((item) => <Link key={item.path} to={item.path} onClick={onNavigate} className="flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">{item.label}</Link>)}
        </div>
      </div>
    </nav>
  );
}