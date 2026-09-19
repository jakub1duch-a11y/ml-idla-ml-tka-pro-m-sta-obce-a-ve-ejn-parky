import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import PdHero from '@/components/produkt/new/PdHero';
import PdBenefits from '@/components/produkt/new/PdBenefits';
import PdVariants from '@/components/produkt/new/PdVariants';
import PdSpecs from '@/components/produkt/new/PdSpecs';
import PdWireframe from '@/components/produkt/new/PdWireframe';
import PdSmartControl from '@/components/produkt/new/PdSmartControl';
import PdTechSheet from '@/components/produkt/new/PdTechSheet';
import PdDetail from '@/components/produkt/new/PdDetail';
import PdHowItWorks from '@/components/produkt/new/PdHowItWorks';
import PdTabs from '@/components/produkt/new/PdTabs';
import PdMediaGallery from '@/components/produkt/new/PdMediaGallery';
import PdReferences from '@/components/produkt/new/PdReferences';
import PdClosingCta from '@/components/produkt/new/PdClosingCta';
import PdDescription from '@/components/produkt/new/PdDescription';
import PdStory from '@/components/produkt/new/PdStory';
import PdFamilyNav from '@/components/produkt/new/PdFamilyNav';
import PdLineProducts from '@/components/produkt/new/PdLineProducts';
import PdCollectionContext from '@/components/produkt/new/PdCollectionContext';
import PdFaq from '@/components/produkt/new/PdFaq';
import PdScrollProgress from '@/components/produkt/new/PdScrollProgress';
import PdTeepeeRental from '@/components/produkt/new/PdTeepeeRental';
import PdTeepeeStudio from '@/components/produkt/new/PdTeepeeStudio';
import ProductHero from '@/components/ProductHero';

export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
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
        setSEO({ ...getProductSEO(p), robots: 'index, follow' });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

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
      <PdScrollProgress />
      {product.slug === 'teepee' ? <ProductHero product={product} /> : <PdHero product={product} />}
      <PdFamilyNav product={product} />
      <PdTeepeeStudio product={product} />
      <PdDescription product={product} />
      <PdBenefits product={product} />
      <PdStory product={product} />
      <PdMediaGallery product={product} />
      <PdTeepeeRental product={product} />
      <PdSpecs product={product} />
      <PdWireframe product={product} />
      <PdTechSheet product={product} />
      <PdVariants product={product} />
      <PdSmartControl product={product} />
      <PdDetail product={product} />
      <PdHowItWorks />
      <PdTabs product={product} />
      <PdFaq product={product} />
      <PdReferences product={product} />
      <PdCollectionContext product={product} />
      <PdLineProducts product={product} />
      <PdClosingCta product={product} />
    </div>
  );
}