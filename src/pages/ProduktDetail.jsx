import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader, Droplets, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import PdCompactHero from '@/components/produkt/new/PdCompactHero';
import MrakVariantGallery from '@/components/produkt/new/MrakVariantGallery';
import PdVisualGalleryCompact from '@/components/produkt/new/PdVisualGalleryCompact';
import PdMistVariants from '@/components/produkt/new/PdMistVariants';
import PdRealGallery from '@/components/produkt/new/PdRealGallery';
import PdBenefits from '@/components/produkt/new/PdBenefits';
import PdSpecs from '@/components/produkt/new/PdSpecs';
import PdInstallationPrep from '@/components/produkt/new/PdInstallationPrep';
import PdReferences from '@/components/produkt/new/PdReferences';
import PdClosingCta from '@/components/produkt/new/PdClosingCta';
import PdFamilyNav from '@/components/produkt/new/PdFamilyNav';
import StebloGateDetail from '@/components/produkt/StebloGateDetail';
import { getCatalogWaterLabel } from '@/components/produkt/nozzles/nozzleData';
import BendyDetailSections from '@/components/produkt/details/BendyDetailSections';

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
        setProduct({ ...p, water_consumption: getCatalogWaterLabel(p.slug) || p.water_consumption });
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
    <section className="flex min-h-[70svh] items-center justify-center bg-[radial-gradient(ellipse_at_top,#E8F8FC_0%,#FFFFFF_58%)] px-5 pb-20 pt-32">
      <div className="w-full max-w-2xl rounded-[2rem] border border-[#DCEEF5] bg-white/90 p-7 text-center shadow-[0_24px_80px_rgba(13,47,79,.08)] sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F8FC] text-[#0B5EA8]"><Droplets size={26} aria-hidden="true" /></span>
        <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[.18em] text-[#0B5EA8]">Produktový katalog MLŽIDLA®</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0D2F4F] sm:text-4xl">Tento detail se nám nepodařilo načíst.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#35546B]">Produkt může mít aktualizovaný odkaz nebo právě upravujeme jeho podklady. Prohlédněte si aktuální katalog, případně nám pošlete nezávaznou poptávku — pomůžeme vám najít správnou variantu.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/katalog-mlzitek" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0B5EA8] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#084A86] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B7E6] focus-visible:ring-offset-2">Prohlédnout katalog <ArrowRight size={16} className="ml-2" /></Link>
          <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#B8D9E8] bg-white px-6 py-3 text-sm font-bold text-[#0D2F4F] transition hover:border-[#0B5EA8] hover:bg-[#F4FBFE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B7E6] focus-visible:ring-offset-2">Nezávazně poptat řešení</Link>
        </div>
      </div>
    </section>
  );

  if (product.slug === 'brana-bendy') return <StebloGateDetail product={product} />;

  return (
    <div className="product-detail-page min-h-screen bg-white text-[#07131D]">
      <PdCompactHero product={product} />
      {product.slug === 'mlzitko-mrak' && <MrakVariantGallery />}
      <PdFamilyNav product={product} />
      <PdVisualGalleryCompact product={product} />
      <PdRealGallery product={product} />
      <PdMistVariants product={product} />
      <BendyDetailSections product={product} />
      <div id="parametry" className="scroll-mt-24"><PdSpecs product={product} /></div>
      <div id="vyhody" className="scroll-mt-24"><PdBenefits product={product} /></div>
      <div id="instalace" className="scroll-mt-24"><PdInstallationPrep product={product} /></div>
      <div id="reference" className="scroll-mt-24"><PdReferences product={product} /></div>
      <PdClosingCta product={product} />
    </div>
  );
}