import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader, Ruler, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isArchived } from '@/lib/newMedia';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

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
              Produkty s technickými podklady pro váš projekt.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#0D2F4F]/60">
              Základní přehled materiálu, rozměru a použití — pro rychlé porovnání klientem i architektem.
            </p>
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
                <ProductHoverImage
                  product={p}
                  alt={p.name + ' – produktový náhled'}
                  className="aspect-[4/3] bg-[#EAF5FB]"
                />
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-[#0D2F4F]">{p.name}</h3>
                  {p.short_description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#0D2F4F]/55">{p.short_description}</p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-[#EAF5FB] py-3">
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#0D2F4F]/70">
                      <ShieldCheck size={14} className="shrink-0 text-[#0B5EA8]" />
                      <span className="truncate">{p.material?.includes('316') ? 'Nerez AISI 316L' : (p.material || 'Projektové provedení')}</span>
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-[#0D2F4F]/70">
                      <Ruler size={14} className="shrink-0 text-[#0B5EA8]" />
                      <span className="truncate">{p.coverage_area || 'Rozměr na míru'}</span>
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[#0B5EA8]">Produktový detail</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D2F4F] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#0B5EA8]">
                      Zobrazit model <ArrowRight size={13} />
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