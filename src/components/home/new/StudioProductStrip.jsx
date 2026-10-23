import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getStudioMedia } from '@/lib/studioMedia';

export default function StudioProductStrip() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    base44.entities.Product.filter({ featured: true }, 'name', 60).then((list) => {
      setProducts(list.map((p) => ({ ...p, studio: getStudioMedia(p) })).filter((p) => p.studio).slice(0, 8));
    });
  }, []);

  if (!products.length) return null;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-[1540px] px-5 md:px-12">
        <p className="font-mono text-xs uppercase text-muted-foreground">// Studiové náhledy</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-heading font-bold text-secondary">Mlžítka z naší dílny</h2>
          <Link to="/katalog-mlzitek" className="ds-btn-outline">Celý katalog →</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} to={`/produkt/${p.slug}`} className="ds-card-prod">
              <div className="media"><img src={p.studio} alt={p.image_alt || p.name} loading="lazy" /></div>
              <div className="body">
                <div className="eyebrow">Nerezové mlžítko</div>
                <h3>{p.name}</h3>
                {p.short_description && <p className="line-clamp-2">{p.short_description}</p>}
                <span className="cta">Detail produktu →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}