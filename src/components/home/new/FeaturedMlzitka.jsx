import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isArchived } from '@/lib/newMedia';

export default function FeaturedMlzitka() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list('-created_date', 50)
      .then((all) => {
        const list = (all || []).filter((p) => p.featured && !isArchived(p.slug)).slice(0, 6);
        setProducts(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Doporučená mlžítka</p>
            <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
              Produkty navržené pro veřejný prostor.
            </h2>
          </div>
          <Link
            to="/mlzidla-mlzitka"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0D2F4F]"
          >
            Celý katalog <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="animate-spin text-[#0B5EA8]/40" size={28} /></div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/produkt/${p.slug}`}
                className="group block overflow-hidden border border-[#EAF5FB] bg-white transition-all hover:border-[#0B5EA8]/30"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#EAF5FB]">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#0D2F4F]/20">
                      <span className="font-mono text-xs uppercase">MLŽIDLA</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-[#0D2F4F]">{p.name}</h3>
                  {p.short_description && (
                    <p className="mt-1.5 line-clamp-1 text-sm text-[#0D2F4F]/55">{p.short_description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="border border-[#0B5EA8]/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-[#0B5EA8]">
                      nízkotlaké 2–8 bar / bez čerpadla
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D2F4F] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#0B5EA8]">
                      Zjistit cenu <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}