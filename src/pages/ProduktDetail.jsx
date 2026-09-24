import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Segmented } from 'konsta/react';
import { Segmented } from 'konsta/react';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import PdHero from '@/components/produkt/new/PdHero';
import PdBenefits from '@/components/produkt/new/PdBenefits';
import PdVariants from '@/components/produkt/new/PdVariants';
import PdSpecs from '@/components/produkt/new/PdSpecs';
import PdWireframe from '@/components/produkt/new/PdWireframe';
import PdInstallationPrep from '@/components/produkt/new/PdInstallationPrep';
import PdSmartControl from '@/components/produkt/new/PdSmartControl';
import PdDetail from '@/components/produkt/new/PdDetail';
import PdHowItWorks from '@/components/produkt/new/PdHowItWorks';
import PdTabs from '@/components/produkt/new/PdTabs';
import PdMediaGallery from '@/components/produkt/new/PdMediaGallery';
import PdReferences from '@/components/produkt/new/PdReferences';
import PdClosingCta from '@/components/produkt/new/PdClosingCta';
import PdSectionNav from '@/components/produkt/new/PdSectionNav';
import PdUseCases from '@/components/produkt/new/PdUseCases';
import PdAudienceSolutions from '@/components/produkt/new/PdAudienceSolutions';
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
  const [mobileSection, setMobileSection] = useState('prehled');
  const jumpTo = (id) => {
    setMobileSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const [mobileSection, setMobileSection] = useState('prehled');
  const jumpTo = (id) => {
    setMobileSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    <div className="product-detail-page min-h-screen bg-white">
      <PdScrollProgress />
      <div id="prehled" className="scroll-mt-28">
        {product.slug === 'teepee' ? <ProductHero product={product} /> : <PdHero product={product} />}
      </div>
      <PdSectionNav product={product} />
      <div className="lg:hidden sticky top-16 z-30 mx-auto max-w-md px-4 py-3">
        <div className="rounded-[20px] border border-slate-200/80 bg-white/85 p-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
          <Segmented strong>
            {[['prehled','Přehled'],['parametry','Parametry'],['reference','Reference']].map(([id,label]) => (
              <button type="button" key={id} aria-pressed={mobileSection === id} onClick={() => jumpTo(id)}
                className={`min-h-11 flex-1 rounded-[14px] px-2 text-[11px] font-semibold transition-colors ${mobileSection === id ? 'bg-slate-950 text-white' : 'text-slate-600'}`}>
                {label}
              </button>
            ))}
          </Segmented>
        </div>
      </div>
      <PdFamilyNav product={product} />
      <PdTeepeeStudio product={product} />
      <PdDescription product={product} />
      <div id="vyhody" className="scroll-mt-28"><PdBenefits product={product} /></div>
      <PdStory product={product} />
      <PdAudienceSolutions product={product} />
      <PdUseCases product={product} />
      <PdMediaGallery product={product} />
      <PdTeepeeRental product={product} />
      <div id="parametry" className="scroll-mt-28"><PdSpecs product={product} /></div>
      <PdWireframe product={product} />
      <div id="instalace" className="scroll-mt-28"><PdInstallationPrep product={product} /></div>
      <div id="konfigurace" className="scroll-mt-28"><PdVariants product={product} /></div>
      <div id="chytre-rizeni" className="scroll-mt-28"><PdSmartControl product={product} /></div>
      <PdDetail product={product} />
      <PdHowItWorks product={product} />
      <PdTabs product={product} />
      <PdFaq product={product} />
      <div id="reference" className="scroll-mt-28"><PdReferences product={product} /></div>
      <PdCollectionContext product={product} />
      <PdLineProducts product={product} />
      <PdClosingCta product={product} />
    </div>
  );
}
