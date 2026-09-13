import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TechnicalBlueprintBackground from '@/components/products/TechnicalBlueprintBackground';

const SLOGAN = 'Samostojná mlžná trojnožka';

/** Hero produktu s videosmyčkou na pozadí. Data načte přes SDK podle slugu, pokud nedostane `product`. */
export default function ProductHero({ slug = 'teepee', product: given, slogan = SLOGAN }) {
  const [product, setProduct] = useState(given || null);

  useEffect(() => {
    if (given) { setProduct(given); return; }
    base44.entities.Product.filter({ slug }).then((r) => setProduct(r[0] || null));
  }, [slug, given]);

  if (!product) return <section className="min-h-[70vh] bg-[#0A1628]" />;

  const poster = product.hero_background_url || product.image_url;

  return (
    <section className="relative flex min-h-[78vh] items-end overflow-hidden bg-[#0A1628] text-white">
      {product.video_url ? (
        <video src={product.video_url} poster={poster} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <img src={poster} alt={product.image_alt || product.name} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/55 to-[#0A1628]/15" />
      <TechnicalBlueprintBackground product={product} theme="dark" autoRotate showBase={false} className="z-[1] opacity-70 mix-blend-screen" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-7 lg:px-10 lg:pb-20">
        <p className="font-mono text-[11px] uppercase tracking-[.24em] text-[#61D5E5]">{product.name}</p>
        <h1 className="mt-4 max-w-[14ch] font-heading text-[clamp(2.4rem,9vw,4.6rem)] font-bold leading-[.95] text-white">{slogan}</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">{product.short_description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="btn-brand-primary-dark">Poptat řešení <ArrowRight size={16} /></Link>
          <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="btn-brand-outline-dark">Vizualizovat v mém prostoru</Link>
        </div>
      </div>
    </section>
  );
}