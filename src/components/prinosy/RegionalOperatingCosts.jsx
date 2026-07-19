import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductOperatingCostCard from '@/components/prinosy/ProductOperatingCostCard';

const PROFILES = { 'bendy-60': 2, 'gate-60-76': 5, 'ostrev-mlzitko': 7 };

export default function RegionalOperatingCosts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { base44.entities.Product.list().then((items) => setProducts((items || []).filter((item) => PROFILES[item.slug]))).finally(() => setLoading(false)); }, []);
  return <section className="border-t border-slate-200 bg-white py-16 lg:py-20"><div className="site-container">
    <div className="max-w-3xl"><p className="content-eyebrow mb-3">Provozní náklady · Trutnov 2026</p><h2 className="content-title text-3xl">Kolik stojí mlžení s našimi produkty.</h2><p className="content-lead mt-4">Výpočet používá standardní trysku M2 při tlaku 4 bar, cenu vodného 75,86 Kč/m³ a celkovou cenu včetně stočného 129,11 Kč/m³. Sezóna představuje 120 dnů.</p></div>
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600"><b className="text-slate-950">Model chytrého provozu:</b> 20 nejteplejších dnů po 8 hodinách a zbývajících 100 dnů průměrně 2 hodiny aktivního mlžení podle pohybu. Skutečná spotřeba závisí na počasí a nastavení.</div>
    {loading ? <div className="flex justify-center py-20"><Loader className="animate-spin text-slate-300" /></div> : <div className="mt-8 grid gap-5 lg:grid-cols-3">{products.map((product) => <ProductOperatingCostCard key={product.id} product={product} nozzles={PROFILES[product.slug]} />)}</div>}
  </div></section>;
}