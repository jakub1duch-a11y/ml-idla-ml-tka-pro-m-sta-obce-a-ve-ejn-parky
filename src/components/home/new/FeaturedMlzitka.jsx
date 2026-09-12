import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isArchived } from '@/lib/newMedia';
import { FAMILIES, getFamily, sortByStructure } from '@/lib/productFamilies';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

export default function FeaturedMlzitka() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list('name', 200)
      .then((all) => setProducts((all || []).filter((p) => !isArchived(p.slug))))
      .finally(() => setLoading(false));
  }, []);

  const familyTiles = useMemo(() => FAMILIES.map((f) => {
    const inFamily = sortByStructure(products.filter((p) => getFamily(p).id === f.id));
    const cover = inFamily.find((p) => p.featured && p.image_url) || inFamily.find((p) => p.image_url);
    return { ...f, count: inFamily.length, cover: cover?.image_url };
  }), [products]);

  const featured = useMemo(() => sortByStructure(products.filter((p) => p.featured)).slice(0, 6), [products]);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// Produktové kolekce</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-[#0A1628] lg:text-4xl">Čtyři kolekce nerezových mlžítek.</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5A6B78]">Od sériových mlžítek PRIME přes průchozí brány a mlžiště až po autorské plastiky CREATIVE. Všechno z jedné české dílny, s řízením SUPLA a technickými listy pro projektanty.</p>
          </div>
          <Link to="/mlzidla-mlzitka" className="btn-brand-accent-link shrink-0">Celý katalog →</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="animate-spin text-[#D3E2E8]" size={28} /></div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {familyTiles.map((f) => (
                <Link key={f.id} to="/mlzidla-mlzitka#catalog" className="card-brand-reference group flex flex-col overflow-hidden !p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#153863]">
                    {f.cover && <img src={f.cover} alt={f.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent" />
                    <span className="absolute left-5 top-5 font-mono text-[11px] tracking-[.14em] text-[#22D3EE]">// {f.code}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="tag">{f.label}</div>
                    <h3 className="!text-xl">{f.title}</h3>
                    <p className="flex-1">{f.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="stat !text-2xl">{f.count}</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#22D3EE]">Otevřít <ArrowRight size={14} /></span>
                    </div>
                    <div className="statlabel">produktů v kolekci</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// Výběr produktů</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-[#0A1628]">Nejčastěji poptávaná mlžítka</h3>
              </div>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => <CatalogProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}