import React from 'react';
import { Link } from 'react-router-dom';
import { MRAK_MODELS } from '@/components/produkt/nozzles/nozzleData';

export default function MrakOtherVariants({ currentId }) {
  const others = MRAK_MODELS.filter((m) => m.id !== currentId);
  return (
    <section className="bg-card px-5 py-14 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs text-muted-foreground">DALŠÍ PROVEDENÍ</p>
        <h2 className="mt-3 font-heading">Ostatní varianty MRAK</h2>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {others.map((m) => (
            <Link key={m.id} to={`/produkt/mlzitko-mrak/varianta/${m.id}`} className="border border-border bg-background transition-colors hover:border-primary">
              <img src={m.image} alt={m.name} loading="lazy" className="aspect-square w-full object-contain" />
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{m.concept ? 'Designový návrh' : 'Katalogová varianta'}</p>
                <h3 className="mt-1 font-heading text-lg">{m.name}</h3>
                <p className="mt-1 text-sm">{m.dimensions} · {m.count} trysek</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}