import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import PdHero from '@/components/produkt/new/PdHero';
import PdBenefits from '@/components/produkt/new/PdBenefits';
import PdVariants from '@/components/produkt/new/PdVariants';
import PdSpecs from '@/components/produkt/new/PdSpecs';
import PdDetail from '@/components/produkt/new/PdDetail';
import PdHowItWorks from '@/components/produkt/new/PdHowItWorks';
import PdTabs from '@/components/produkt/new/PdTabs';
import PdReferences from '@/components/produkt/new/PdReferences';
import PdClosingCta from '@/components/produkt/new/PdClosingCta';

export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug === 'gate70') { navigate('/gate70', { replace: true }); return; }
    setLoading(true);
    setNotFound(false);
    base44.entities.Product.filter({ slug })
      .then((results) => {
        if (!results || results.length === 0) { setNotFound(true); return; }
        const p = results[0];
        if (isArchived(p.slug)) { setNotFound(true); return; }
        setProduct(p);
        trackProductView(p.name, p.slug, p.category_id);
        setSEO({
          title: `${p.name} – nerezové mlžítko | MLŽIDLA.cz`,
          description: p.short_description || `${p.name} — nerezové mlžítko pro veřejný prostor, česká výroba HolmTec.`,
          image: p.image_url,
          canonicalPath: `/produkt/${p.slug}`,
          robots: new URLSearchParams(location.search).has('variant') ? 'noindex, follow' : 'index, follow',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.name,
            description: p.short_description,
            image: p.image_url,
            brand: { '@type': 'Brand', name: 'MLŽIDLA' },
            manufacturer: { '@type': 'Organization', name: 'HolmTec s.r.o.' },
            url: `https://mlzidla.cz/produkt/${p.slug}`,
            ...(p.price_from ? { offers: { '@type': 'Offer', price: p.price_from, priceCurrency: 'CZK', url: `https://mlzidla.cz/produkt/${p.slug}` } } : {}),
          },
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, navigate, location.search]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Loader className="animate-spin text-[#0B5EA8]/40" size={28} />
    </div>
  );

  if (notFound || !product) return (
    <div className="flex min-h-screen items-center justify-center bg-white pt-28">
      <div className="text-center">
        <p className="mb-4 text-lg text-[#0D2F4F]/40">Produkt nenalezen.</p>
        <Link to="/mlzidla-mlzitka" className="text-[#0B5EA8] hover:underline">← Zpět na katalog</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <PdHero product={product} />
      <PdBenefits product={product} />
      <PdVariants product={product} />
      <PdSpecs product={product} />
      <PdDetail product={product} />
      <PdHowItWorks product={product} />
      <PdTabs product={product} />
      <PdReferences product={product} />
      <PdClosingCta product={product} />
    </div>
  );
}