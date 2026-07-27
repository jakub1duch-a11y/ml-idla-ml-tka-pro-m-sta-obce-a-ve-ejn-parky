import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CatalogHomeHero({ productCount }) {
  return <section className="bg-foreground py-20 text-background sm:py-28">
    <div className="site-container grid items-end gap-10 lg:grid-cols-[1.25fr_.75fr]">
      <div>
        <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-primary"><Sparkles size={14} /> Kolekce HolmTec</p>
        <h1 className="m-0 max-w-4xl font-heading text-5xl font-light tracking-tight sm:text-7xl">Mlžítka pro prostor, ve kterém se chcete zdržet.</h1>
      </div>
      <div className="border-l border-background/20 pl-6 sm:pl-8">
        <p className="mb-7 text-lg leading-relaxed text-background/70">Prohlédněte si nerezové mlžné prvky pro města, zahrady, terasy i eventy.</p>
        <Link to="#kolekce" className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-85">Prohlédnout kolekci <ArrowRight size={17} /></Link>
        <p className="mt-6 text-sm text-background/50">{productCount ? `${productCount} modelů v aktuálním katalogu` : 'Aktuální katalog HolmTec'}</p>
      </div>
    </div>
  </section>;
}