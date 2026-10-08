import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { preparePublicCatalogProducts } from '@/lib/publicCatalogProducts';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';
import ProductExperience from '@/components/ui/ProductExperience';

export default function HomeProductOverview() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    base44.entities.Product.list('name', 200)
      .then((records) => { if (active) setProducts(preparePublicCatalogProducts(records || [])); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <section id="home-product-overview" className="premium-section bg-white" aria-labelledby="products-premium-title">
    <div className="premium-shell">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-800">Kompletní nabídka</p>
          <h2 id="products-premium-title" className="mt-4 font-heading text-4xl font-black tracking-tight text-[#07131D] sm:text-5xl">Najděte tvar pro svůj prostor.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Prohlédněte si jednotlivá mlžítka, brány i sestavy. V detailu najdete fotografie, technické informace a možnosti instalace.</p>
        </div>
        <Link to="/katalog-mlzitek#catalog" className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-[#082C3F] px-6 text-sm font-semibold text-white">Filtrovat katalog <ArrowRight size={17} /></Link>
      </div>
      {loading ? <div className="flex justify-center gap-3 py-12 text-slate-600" role="status"><Loader size={22} className="motion-safe:animate-spin" /> Načítání produktů…</div> :
        products.length ? <ProductExperience products={products}><div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <CatalogProductCard key={product.id || product.slug} product={product} />)}</div></ProductExperience> :
        <p className="rounded-2xl bg-slate-50 p-6 text-sm leading-6 text-slate-600" role="status">{failed ? 'Produkty se nepodařilo načíst. ' : 'Aktuální nabídku vám rádi upřesníme. '}<Link to="/katalog-mlzitek" className="font-semibold text-cyan-800 underline">Otevřít katalog</Link> nebo <Link to="/poptavka" className="font-semibold text-cyan-800 underline">kontaktovat nás</Link>.</p>}
    </div>
  </section>;
}
