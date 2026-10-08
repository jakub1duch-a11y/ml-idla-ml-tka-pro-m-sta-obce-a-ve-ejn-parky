import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import PdHero from '@/components/produkt/new/PdHero';
import PdCompactHero from '@/components/produkt/new/PdCompactHero';
import PdVisualGalleryCompact from '@/components/produkt/new/PdVisualGalleryCompact';
import PdViewModeSwitch from '@/components/produkt/new/PdViewModeSwitch';
import PdBenefits from '@/components/produkt/new/PdBenefits';
import PdVariants from '@/components/produkt/new/PdVariants';
import PdSpecs from '@/components/produkt/new/PdSpecs';
import PdWireframe from '@/components/produkt/new/PdWireframe';
import PdInstallationPrep from '@/components/produkt/new/PdInstallationPrep';
import PdSmartControl from '@/components/produkt/new/PdSmartControl';
import PdDetail from '@/components/produkt/new/PdDetail';
import PdHowItWorks from '@/components/produkt/new/PdHowItWorks';
import PdTabs from '@/components/produkt/new/PdTabs';
import PdScrollGallery from '@/components/produkt/new/PdScrollGallery';
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

const VIEW_MODES = new Set(['classic', 'standard', 'new']);

export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mobileSection, setMobileSection] = useState('prehled');

  const requestedView = searchParams.get('view');
  const viewMode = VIEW_MODES.has(requestedView) ? requestedView : 'new';

  const setViewMode = (nextMode) => {
    if (!VIEW_MODES.has(nextMode)) return;
    const next = new URLSearchParams(searchParams);
    next.set('view', nextMode);
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <Link to="/katalog-mlzitek" className="text-[#0B5EA8] hover:underline">← Zpět na katalog</Link>
      </div>
    </div>
  );

  const classicHero = (
    <div id="prehled" className="scroll-mt-28">
      {product.slug === 'teepee' ? <ProductHero product={product} /> : <PdHero product={product} />}
    </div>
  );

  return (
    <div className="product-detail-page min-h-screen bg-white">
      {viewMode !== 'new' && <PdScrollProgress />}
      <PdViewModeSwitch mode={viewMode} onChange={setViewMode} />

{viewMode === 'classic' && (
  <>
    {classicHero}
    <PdSectionNav product={product} />

          <div className="sticky top-[116px] z-30 mx-auto max-w-md px-4 py-3 lg:hidden">
            <div className="rounded-[20px] border border-slate-200/80 bg-white/90 p-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
              <div className="flex gap-1">
                {[
                  ['prehled', 'Přehled'],
                  ['galerie', 'Galerie'],
                  ['parametry', 'Parametry'],
                  ['reference', 'Reference'],
                ].map(([id, label]) => (
                  <button
                    type="button"
                    key={id}
                    aria-pressed={mobileSection === id}
                    onClick={() => jumpTo(id)}
                    className={`min-h-11 flex-1 rounded-[14px] px-2 text-[11px] font-semibold transition-colors ${mobileSection === id ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <PdFamilyNav product={product} />
          <PdTeepeeStudio product={product} />
          <PdDescription product={product} />
          <div id="galerie" className="scroll-mt-16"><PdScrollGallery product={product} /></div>
          <div id="parametry" className="scroll-mt-28"><PdSpecs product={product} /></div>
          <div id="vyhody" className="scroll-mt-28"><PdBenefits product={product} /></div>
          <PdStory product={product} />
          <PdAudienceSolutions product={product} />
          <PdUseCases product={product} />
          <PdTeepeeRental product={product} />
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
        </>
      )}

      {viewMode === 'standard' && (
        <>
          {classicHero}
          <PdFamilyNav product={product} />
          <PdDescription product={product} />
          <PdVisualGalleryCompact product={product} />
          <div id="parametry" className="scroll-mt-28"><PdSpecs product={product} /></div>
          <div id="konfigurace" className="scroll-mt-28"><PdVariants product={product} /></div>
          <div id="chytre-rizeni" className="scroll-mt-28"><PdSmartControl product={product} /></div>
          <div id="reference" className="scroll-mt-28"><PdReferences product={product} /></div>
          <div id="instalace" className="scroll-mt-28"><PdInstallationPrep product={product} /></div>
          <PdClosingCta product={product} />
        </>
      )}

      {viewMode === 'new' && (
        <>
          <PdCompactHero product={product} />
          <PdVisualGalleryCompact product={product} />
          <div id="parametry" className="scroll-mt-28"><PdSpecs product={product} /></div>
          <div id="vyhody" className="scroll-mt-28"><PdBenefits product={product} /></div>
          <div id="instalace" className="scroll-mt-28"><PdInstallationPrep product={product} /></div>
          <div id="reference" className="scroll-mt-28"><PdReferences product={product} /></div>
          <PdClosingCta product={product} />
        </>
      )}
    </div>
  );
}
