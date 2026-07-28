import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import CatalogProductCard from '@/components/katalog/CatalogProductCard';

const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';

export default function UsageRecommendedProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => { base44.entities.Product.list().then((items) => setProducts(items.filter((item) => item.category_id !== ACCESSORY_CATEGORY_ID && !/zemní|vrut|trysk|příslušenství/i.test(item.name || '')))).catch(() => setProducts([])); }, []);
  return <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20"><div className="site-container"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0070F3]">Doporučené modely</p><h2 className="mt-3 text-slate-950">Mlžítka pro váš projekt.</h2><p className="mt-3 max-w-2xl text-slate-600">Zobrazujeme pouze mlžítka a mlžné konstrukce, bez příslušenství, trysek a zemních vrutů.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <CatalogProductCard key={product.id} product={product} />)}</div></div></section>;
}