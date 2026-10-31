import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';

export default function MrakVariantCard({ variant, selected }) {
  return (
    <article className={`min-w-0 overflow-hidden rounded-[28px] border bg-card ${selected ? 'border-primary shadow-md' : 'border-border'}`}>
      <div className="min-w-0 p-4 sm:p-6">
        <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">{variant.title}</h3>
        <p className="mt-2 break-words font-mono text-base font-semibold text-primary sm:text-lg">{variant.size}</p>
        {variant.wall && <p className="mt-1 text-sm text-muted-foreground">Tloušťka stěny {variant.wall}</p>}
        {variant.audience && <p className="mt-3 text-base font-semibold text-primary">{variant.audience}</p>}
        <p className="mt-3 text-base text-muted-foreground">{variant.text}</p>
        {selected ? (
          <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground sm:w-auto"><Check size={16} className="shrink-0" /> Zobrazený typ</span>
        ) : (
          <Link to={`/produkt/${variant.slug}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto">Zobrazit {variant.title}<ArrowUpRight size={16} className="shrink-0" /></Link>
        )}
      </div>
      <div className="min-w-0 px-4 pb-4 sm:px-5 sm:pb-5">
        <img src={variant.studio} alt={`${variant.title} – ilustrační studiový náhled`} loading="lazy" className="aspect-square w-full max-w-full rounded-2xl border border-border bg-card object-contain sm:aspect-[4/3]" />
        <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          {variant.details.map((detail) => (
            <figure key={detail.src} className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
              <img src={detail.src} alt={`${variant.title} – ${detail.label}`} loading="lazy" className="aspect-[3/2] w-full object-cover" />
              <figcaption className="break-words px-3 py-3 text-sm text-muted-foreground">{detail.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </article>
  );
}