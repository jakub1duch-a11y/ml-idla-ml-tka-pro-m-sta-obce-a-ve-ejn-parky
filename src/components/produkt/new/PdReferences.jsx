import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isArchived } from '@/lib/newMedia';

export default function PdReferences({ product }) {
  const [refs, setRefs] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Realizace.filter({ published: true }, '-year', 50).catch(() => []),
      base44.entities.Product.filter({ category_id: product.category_id }).catch(() => []),
    ]).then(([allRefs, allProducts]) => {
      const refsList = (allRefs || []).filter((r) => {
        const used = (r.product_used || '').toLowerCase();
        const name = (product.name || '').toLowerCase();
        return used.includes(name) || name.includes(used);
      }).slice(0, 3);
      setRefs(refsList);

      const sim = (allProducts || [])
        .filter((p) => p.id !== product.id && !isArchived(p.slug))
        .slice(0, 3);
      setSimilar(sim);
    }).finally(() => setLoading(false));
  }, [product.id, product.name, product.category_id]);

  if (loading) return <div className="flex justify-center py-12"><Loader className="animate-spin text-[#0B5EA8]/40" /></div>;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {refs.length > 0 && (
          <div className="mb-16">
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Reference s tímto produktem</p>
            <h2 className="mt-4 font-heading text-2xl leading-tight text-[#0D2F4F] lg:text-3xl">Realizace, kde se {product.name} používá.</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {refs.map((r) => (
                <Link key={r.id} to={`/reference/${r.id}`} className="group block overflow-hidden border border-[#EAF5FB] transition-all hover:border-[#0B5EA8]/30">
                  <div className="aspect-[4/3] overflow-hidden bg-[#EAF5FB]">
                    {r.image_url && <img src={r.image_url} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-semibold text-[#0D2F4F]">{r.name}</h3>
                    <p className="mt-1 text-xs text-[#0D2F4F]/50">{r.client} · {r.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Podobná mlžítka</p>
            <h2 className="mt-4 font-heading text-2xl leading-tight text-[#0D2F4F] lg:text-3xl">Mohlo by vás zajímat.</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <Link key={p.id} to={`/produkt/${p.slug}`} className="group block overflow-hidden border border-[#EAF5FB] transition-all hover:border-[#0B5EA8]/30">
                  <div className="aspect-[4/3] overflow-hidden bg-[#EAF5FB]">
                    {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-heading text-sm font-semibold text-[#0D2F4F]">{p.name}</h3>
                      {p.short_description && <p className="mt-0.5 line-clamp-1 text-xs text-[#0D2F4F]/50">{p.short_description}</p>}
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-[#0B5EA8]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}