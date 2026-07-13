import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, getProductSEO } from '@/lib/seo';
import ProductLeftPanel from '@/components/produkt2/ProductLeftPanel';
import ProductRightHeader from '@/components/produkt2/ProductRightHeader';
import ProductTabsNav from '@/components/produkt2/ProductTabsNav';
import ProductTabContent from '@/components/produkt2/ProductTabContent';

export default function ProduktDetail2() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('o-produktu');

  useEffect(() => {
    base44.entities.ProductCategory.list().then(setCategories).catch(() => []);
  }, []);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    base44.entities.Product.filter({ slug }).then((results) => {
      if (!results || results.length === 0) { setNotFound(true); return; }
      setProduct(results[0]);
      setSEO(getProductSEO(results[0]));
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <Loader size={28} className="animate-spin text-white/30" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-white/40 mb-4 text-lg font-mono">[Produkt nenalezen]</p>
        <Link to="/mlzidla-mlzitka" className="text-white hover:underline font-mono text-sm">← Zpět na mlžítka</Link>
      </div>
    </div>
  );

  const categoryName = categories.find((c) => c.id === product.category_id)?.name || '';

  const specRows = [
    product.material && { label: 'Materiál', value: product.material },
    product.micron_size && { label: 'Trysky', value: `${product.micron_size} μm` },
    product.pressure && { label: 'Tlak', value: product.pressure },
    product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product.coverage_area && { label: 'Výška / pokrytí', value: product.coverage_area },
    product.power_supply && { label: 'Napájení', value: product.power_supply },
    product.price_from && { label: 'Cena od', value: `${product.price_from.toLocaleString('cs-CZ')} Kč` },
  ].filter(Boolean);

  const callouts = specRows.slice(0, 4).map((r, i) => ({ label: r.label, top: `${18 + i * 20}%` }));

  return (
    <div className="min-h-screen bg-ink">
      <Link to="/mlzidla-mlzitka" className="fixed top-20 left-4 z-30 inline-flex items-center gap-1.5 px-3 py-2 bg-black/50 border border-white/15 text-white/70 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-colors">
        <ArrowLeft size={12} /> Zpět
      </Link>
      <div className="flex flex-col lg:flex-row">
        <ProductLeftPanel image={product.image_url} callouts={callouts} />
        <div className="w-full lg:w-[58%] text-white">
          <ProductRightHeader product={product} categoryName={categoryName} />
          <ProductTabsNav active={activeTab} onChange={setActiveTab} />
          <div className="p-8 lg:p-14">
            <ProductTabContent tab={activeTab} product={product} specRows={specRows} />
          </div>
        </div>
      </div>
    </div>
  );
}