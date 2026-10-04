import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { isArchived } from '@/lib/newMedia';
import { getLine, getFamily, sortByStructure } from '@/lib/productFamilies';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

export default function PdLineProducts({ product }) {
  const [items, setItems] = useState([]);
  const line = getLine(product);
  const family = getFamily(product);

  useEffect(() => {
    base44.entities.Product.list('name', 200).then((all) => {
      const pool = (all || []).filter((p) => p.id !== product.id && !isArchived(p.slug));
      const sameLine = pool.filter((p) => getLine(p).key === line.key);
      const sameFamily = pool.filter((p) => getFamily(p).id === family.id && getLine(p).key !== line.key);
      setItems(sortByStructure([...sameLine, ...sameFamily]).slice(0, 3));
    });
  }, [product.id, line.key, family.id]);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-[#D3E2E8] bg-[#F4FAFC] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// {family.label} · {line.label}</p>
        <h2 className="mt-3 font-heading text-2xl font-semibold text-[#0A1628] sm:text-3xl">Další produkty z řady a kolekce</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => <CatalogProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}