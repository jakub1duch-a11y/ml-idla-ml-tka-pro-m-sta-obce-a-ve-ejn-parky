import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Droplets, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductView, trackInquirySubmitted } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import PdCompactHero from '@/components/produkt/new/PdCompactHero';
import PdProductSuggestions from '@/components/produkt/new/PdProductSuggestions';
import PdVisualGalleryCompact from '@/components/produkt/new/PdVisualGalleryCompact';
import ProductMotionSection from '@/components/produkt/ProductMotionSection';
import PdBenefits from '@/components/produkt/new/PdBenefits';
import PdSpecs from '@/components/produkt/new/PdSpecs';
import PdInstallationPrep from '@/components/produkt/new/PdInstallationPrep';
import PdSuplaControl from '@/components/produkt/new/PdSuplaControl';
import PdFaq from '@/components/produkt/new/PdFaq';
import PdReferences from '@/components/produkt/new/PdReferences';
import PdClosingCta from '@/components/produkt/new/PdClosingCta';
import AvenueConfigurator from '@/components/produkt/avenue/AvenueConfigurator';
import PdFamilyNav from '@/components/produkt/new/PdFamilyNav';
import PdSectionNav from '@/components/produkt/new/PdSectionNav';
import PdDescription from '@/components/produkt/new/PdDescription';
import BrandLoadingContent from '@/components/common/BrandLoadingContent';
import QuickVariantInquiry from '@/components/produkt/QuickVariantInquiry';

function verifiedVariants(product) {
  // Do not infer variants from marketing text or create undocumented technical data.
  const rows = Array.isArray(product.variants) ? product.variants : [];
  return rows.filter(v => v && (v.id || v.slug) && v.name).map(v => ({
    id: String(v.id || v.slug),
    name: String(v.name),
    differences: v.differences && typeof v.differences === 'object' && !Array.isArray(v.differences) ? v.differences : {},
    technicalSheetUrl: typeof v.technical_sheet_url === 'string' && /^https:\/\//.test(v.technical_sheet_url) ? v.technical_sheet_url : null,
  }));
}

export default function ProduktDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
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
  }, [slug]);

  const submitQuickInquiry = async (payload) => {
    // The existing backend accepts contact details and a message. Do not silently
    // discard attachments: block until a verified private upload endpoint exists.
    if (payload.photos?.length) throw new Error('photo_upload_not_configured');
    const response = await base44.functions.invoke('submitPoptavka', {
      jmeno: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
      email: payload.email,
      telefon: payload.phone,
      firma: '',
      produkt: product.name,
      service_type: product.slug,
      zprava: [
        'Rychlá poptávka z detailu produktu',
        'Produkt: ' + product.name + ' (' + product.slug + ')',
        'Výběr: ' + (payload.selectionMode === 'all' ? 'všechny varianty' : 'jedna varianta'),
        'ID variant: ' + payload.variantIds.join(', '),
        payload.city && 'Město: ' + payload.city,
        payload.installationSite && 'Místo instalace: ' + payload.installationSite,
        payload.note && 'Poznámka: ' + payload.note,
        'Zdroj: ' + payload.sourceUrl,
      ].filter(Boolean).join('\\n'),
    });
    if (response?.data?.error || response?.error || response?.data?.success === false || response?.success === false || !((response?.data?.inquiry?.id) || (response?.inquiry?.id))) throw new Error('submit_not_confirmed');
    trackInquirySubmitted('quick_variant_inquiry', product.slug, response?.data?.inquiry?.id || '');
  };
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <BrandLoadingContent />
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


  return (
    <div className="product-detail-page min-h-screen bg-background text-foreground pt-[var(--site-header-height)]">
      <PdCompactHero product={product} />
      <QuickVariantInquiry product={product} variants={verifiedVariants(product)} onSubmit={submitQuickInquiry} />
      <PdFamilyNav product={product} />
      <PdSectionNav product={product} />
      <PdDescription product={product} />
      <div id="parametry" className="scroll-mt-36"><PdSpecs product={product} /></div>
      <AvenueConfigurator product={product} />
      <div id="galerie" className="scroll-mt-36"><PdVisualGalleryCompact product={product} /></div>
      <ProductMotionSection key={product.slug} product={product} />
      <div id="vyhody" className="scroll-mt-24"><PdBenefits product={product} /></div>
      <div id="instalace" className="scroll-mt-24"><PdInstallationPrep product={product} /></div>
      <PdSuplaControl product={product} />
      <PdFaq product={product} />
      <div id="reference" className="scroll-mt-24"><PdReferences product={product} /></div>
      <section className="mx-auto max-w-7xl px-5 py-10"><div className="rounded-3xl border border-cyan-900/15 bg-[#eef8fb] p-7 md:p-10"><h2 className="text-2xl font-semibold">Filtrace a úprava vody pro mlžítko</h2><p className="mt-3 max-w-3xl text-slate-600">Kvalita vstupní vody ovlivňuje zanášení trysek a nároky na údržbu. Podle tvrdosti vody lze doplnit vhodnou filtraci nebo změkčovač.</p><Link to="/uprava-vody" className="mt-5 inline-flex font-semibold text-[#0b4860] underline underline-offset-4">Jak upravovat vodu pro nízkotlaká mlžítka →</Link></div></section>
      <PdClosingCta product={product} />
      <PdProductSuggestions product={product} />
    </div>
  );
}