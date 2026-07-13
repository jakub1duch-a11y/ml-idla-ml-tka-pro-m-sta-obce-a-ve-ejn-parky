import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, getProductSEO } from '@/lib/seo';
import SectionNav from '@/components/produkt2/SectionNav';
import HeroSlide from '@/components/produkt2/HeroSlide';
import InfoSlide from '@/components/produkt2/InfoSlide';
import SpecsWaterSlide from '@/components/produkt2/SpecsWaterSlide';
import BenefitsSlide from '@/components/produkt2/BenefitsSlide';
import VideoMistCtaSlide from '@/components/produkt2/VideoMistCtaSlide';
import RelatedBackSlide from '@/components/produkt2/RelatedBackSlide';

function guessNozzleCount(product) {
  const text = `${product.short_description || ''} ${product.description || ''}`;
  const match = text.match(/(\d+)\s*trys/i);
  return match ? Math.min(16, Math.max(1, Number(match[1]))) : 6;
}

export default function ProduktDetail2() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const specsRef = useRef(null);
  const benefitsRef = useRef(null);
  const videoRef = useRef(null);
  const relatedRef = useRef(null);

  useEffect(() => {
    base44.entities.ProductCategory.list().then(setCategories).catch(() => []);
  }, []);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    base44.entities.Product.filter({ slug }).then(async (results) => {
      if (!results || results.length === 0) { setNotFound(true); return; }
      const p = results[0];
      setProduct(p);
      setSEO(getProductSEO(p));
      if (p.category_id) {
        const rel = await base44.entities.Product.filter({ category_id: p.category_id }).catch(() => []);
        setRelated((rel || []).filter((r) => r.id !== p.id).slice(0, 3));
      }
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

  const sections = [
    { id: 'hero', label: 'Úvod', ref: heroRef },
    { id: 'info', label: 'O produktu', ref: infoRef },
    { id: 'specs', label: 'Spotřeba vody', ref: specsRef },
    { id: 'benefits', label: 'Benefity', ref: benefitsRef },
    { id: 'video', label: 'Poptat produkt', ref: videoRef },
    { id: 'related', label: 'Podobné', ref: relatedRef },
  ];

  return (
    <div className="min-h-screen bg-ink">
      <Link to="/mlzidla-mlzitka" className="fixed top-20 left-4 z-30 inline-flex items-center gap-1.5 px-3 py-2 bg-black/50 border border-white/15 text-white/70 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-colors">
        <ArrowLeft size={12} /> Zpět
      </Link>

      <SectionNav sections={sections} />

      <div ref={heroRef}>
        <HeroSlide product={product} categoryName={categoryName} onScrollNext={() => infoRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      </div>
      <div ref={infoRef}>
        <InfoSlide product={product} />
      </div>
      <div ref={specsRef}>
        <SpecsWaterSlide specRows={specRows} defaultNozzles={guessNozzleCount(product)} />
      </div>
      <div ref={benefitsRef}>
        <BenefitsSlide />
      </div>
      <div ref={videoRef}>
        <VideoMistCtaSlide product={product} />
      </div>
      <div ref={relatedRef}>
        <RelatedBackSlide related={related} />
      </div>
    </div>
  );
}