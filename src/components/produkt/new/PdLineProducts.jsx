import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { isPublicCatalogProduct } from '@/lib/publicCatalogProducts';
import { LINES, getLine, getFamily } from '@/lib/productFamilies';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

export default function PdLineProducts({ product }) {
  const line = getLine(product);
  const family = getFamily(product);
  const slugs = Object.entries(LINES)
    .filter(([key, value]) => value.family === family.id && (line.key !== 'mrak' || key !== 'mrak'))
    .flatMap(([, value]) => value.slugs)
    .filter((slug) => slug !== product.slug && isPublicCatalogProduct({ slug }));
  const { data, isPending, isError } = useQuery({
    queryKey: ['product-recommendations', product.slug, family.id],
    queryFn: () => base44.entities.Product.filter({ slug: { $in: slugs }, active: { $ne: false } }, { sort: '-featured', limit: 3 }),
  });
  const items = data?.items || [];
  if (!isPending && !isError && items.length === 0) return null;

  return (
    <section className="border-t border-[#D3E2E8] bg-[#F4FAFC] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// {family.label} · {line.label}</p>
        <h2 className="mt-3 font-heading text-2xl font-semibold text-[#0A1628] sm:text-3xl">Doporučené další produkty</h2>
        {isPending && <p role="status" className="mt-6 text-muted-foreground">Načítání doporučených produktů…</p>}
        {isError && <p role="alert" className="mt-6 text-muted-foreground">Doporučené produkty se nepodařilo načíst.</p>}
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0 [&_h3]:break-words">
          {items.map((p) => <CatalogProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}