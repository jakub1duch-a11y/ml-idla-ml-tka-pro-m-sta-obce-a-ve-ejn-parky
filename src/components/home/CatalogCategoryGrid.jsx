import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CatalogCategoryGrid({ categories }) {
  return <section id="kolekce" className="py-20 sm:py-28">
    <div className="site-container">
      <p className="content-eyebrow">Vyberte podle prostoru</p>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4"><h2 className="content-title m-0">Kolekce mlžných systémů</h2><Link to="/katalog" className="text-sm font-bold text-primary hover:underline">Celý katalog</Link></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => <Link key={category.id} to="/katalog" className="group min-h-56 overflow-hidden rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lg">
          {category.image_url && <img src={category.image_url} alt="" className="mb-6 h-20 w-full rounded-md object-cover opacity-80" />}
          <div className="flex h-full flex-col justify-end"><ArrowUpRight size={20} className="mb-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /><h3 className="m-0 text-xl">{category.name}</h3><p className="mt-3 text-sm text-muted-foreground">{category.description}</p></div>
        </Link>)}
      </div>
    </div>
  </section>;
}