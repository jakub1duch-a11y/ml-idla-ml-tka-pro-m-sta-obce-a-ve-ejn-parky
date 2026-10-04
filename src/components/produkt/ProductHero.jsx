import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Play, Snowflake, Leaf, Users, ScanLine } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';
import { getProductDetailConfig } from '@/lib/productDetailConfig';

export default function ProductHero({ product, allMedia = [], onOpenLightbox }) {
  const location = useLocation();
  const videoRef = useRef(null);
  const query = new URLSearchParams(location.search);
  const heroImage = allMedia.find((item) => item.type === 'image')?.url || product.image_url || product.gallery_urls?.[0];
  const heroVideo = allMedia.find((item) => item.type === 'video')?.url || product.video_url;
  const selectedName = product.slug === 'mlzitko-mrak' && query.get('variant') ? `${product.name} · ${query.get('variant')}` : product.name;
  const detailConfig = getProductDetailConfig(product);
  const tagline = detailConfig.tagline || product.short_description || 'Designové mlžítko pro příjemnější venkovní prostor';

  const playVideo = () => {
    if (!heroVideo) return;
    const index = allMedia.findIndex((item) => item.type === 'video');
    if (index >= 0) onOpenLightbox?.(index);
  };

  return (
    <section className="product-detail-hero relative min-h-[560px] overflow-hidden bg-[#0a2731] text-white sm:min-h-[600px] lg:min-h-[610px] xl:min-h-[690px]">
      {heroImage && <img src={heroImage} alt={`${product.name} – hlavní vizualizace`} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,17,23,.86)_0%,rgba(2,17,23,.64)_34%,rgba(2,17,23,.16)_64%,rgba(2,17,23,.04)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-end px-5 pb-8 pt-24 sm:min-h-[600px] sm:px-6 lg:min-h-[610px] lg:px-7 lg:pb-9 xl:min-h-[690px] xl:px-10 xl:pb-12">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[.28em] text-white/80">{product.name}</p>
          <h1 className="mt-4 max-w-xl font-heading text-[2.45rem] font-semibold leading-[1.02] tracking-[-.045em] text-white sm:text-5xl lg:text-[3.25rem] xl:text-[4rem]">{tagline}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/82 sm:text-lg">{detailConfig.intro || product.short_description}</p>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3 text-xs text-white/85 lg:max-w-[720px]">
            <span className="inline-flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#62cbed] text-white"><Snowflake size={18}/></span>Příjemné ochlazení</span>
            <span className="inline-flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#62cbed] text-white"><Leaf size={18}/></span>Čistý nerezový design</span>
            <span className="inline-flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#62cbed] text-white"><Users size={18}/></span>Komfortnější venkovní prostor</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 lg:max-w-[760px]">
            <Link to={`/kontakt?produkt=${encodeURIComponent(selectedName)}`} onClick={() => trackQuickInquiryClick(product.name, 'produkt_hero')} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#8bd9f4] px-6 text-sm font-bold text-[#073747] shadow-[0_12px_30px_rgba(63,181,218,.22)] transition hover:-translate-y-0.5 hover:bg-[#73cfee]">Chci návrh a cenovou nabídku <ArrowRight size={15}/></Link>
            {heroVideo && <button type="button" onClick={playVideo} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/30 bg-black/20 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/35"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50"><Play size={13} fill="currentColor"/></span>Přehrát video</button>}
            <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"><ScanLine size={15}/> Vizualizovat v prostoru</Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 right-8 hidden text-right xl:block">
        <p className="font-heading text-2xl italic leading-tight text-white/90">Více než mlžítko.<br/>Lepší místo.</p>
        <p className="mt-5 text-sm font-bold tracking-wide text-white">HolmTec</p>
        <p className="text-[9px] uppercase tracking-[.2em] text-white/55">technologie pro lepší klima</p>
      </div>
      <video ref={videoRef} className="hidden" />
    </section>
  );
}
