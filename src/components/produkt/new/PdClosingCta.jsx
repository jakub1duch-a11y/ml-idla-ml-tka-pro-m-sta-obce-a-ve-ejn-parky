import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Wind } from 'lucide-react';
import { MlzidlaIcon } from '@/components/brand/MlzidlaLogoSvg';
import { isProductMediaAllowed } from '@/lib/productMediaGuard';
import { responsiveProductSrcSet } from '@/lib/responsiveProductMedia';

// Full-width editorial CTA. Always show the actual catalog product rather than a
// fabricated spatial render; the customer can submit a real site photo.
export default function PdClosingCta({ product }) {
  const [params] = useSearchParams();
  const mrakVariant = product?.slug === 'mlzitko-mrak'
    ? `&varianta=${encodeURIComponent(params.get('variant') === 'velky' ? 'velky' : 'maly')}`
    : '';
  const quoteUrl = `/poptavka?produkt=${encodeURIComponent(product?.slug || '')}${mrakVariant}`;
  const primary = product?.hero_visual_verified === true && product?.hero_product_image_url;
  const mediaCandidate = primary || product?.image_url || '';
  const image = mediaCandidate && isProductMediaAllowed(product, mediaCandidate, product?.name) ? mediaCandidate : '';
  return (
    <section className="relative isolate overflow-hidden bg-[#071A2F] text-white" aria-labelledby="product-project-inquiry">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_90%,rgba(34,211,238,.14),transparent_58%)]" aria-hidden="true" />
      <div className="relative grid min-h-[470px] lg:grid-cols-[1.08fr_.92fr]">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-1250px)/2))] lg:pr-12">
          <div className="flex items-center gap-4">
            <MlzidlaIcon className="h-11 w-12 shrink-0 text-[#67E8F9]" />
            <div className="border-l border-white/30 pl-4">
              <p className="text-[11px] font-semibold uppercase tracking-[.19em] text-[#67E8F9]">MLŽIDLA.cz · návrh pro váš prostor</p>
              <p className="mt-1 text-xs text-white/65">Nerezová mlžítka · výroba HolmTec</p>
            </div>
          </div>
          <h2 id="product-project-inquiry" className="mt-8 max-w-3xl font-heading text-[clamp(2.2rem,4.5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-.05em] text-white">
            Ukažte nám místo.<span className="mt-2 block text-[#87E5ED]">Navrhneme v něm mlžítko.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
            Pošlete nám fotografii nebo situaci prostoru. Posoudíme umístění mlžítka {product.name}, připojení vody, kotvení a vhodné ovládání.
          </p>
          <div className="mt-7 grid max-w-xl gap-3 border-t border-white/20 pt-5 text-sm text-white/75 sm:grid-cols-2">
            <p className="flex items-start gap-2"><ImageIcon size={18} className="mt-0.5 shrink-0 text-[#87E5ED]" aria-hidden="true" /> Fotografie místa nebo projektový nákres</p>
            <p className="flex items-start gap-2"><Wind size={18} className="mt-0.5 shrink-0 text-[#87E5ED]" aria-hidden="true" /> Posouzení větru, posezení a instalace</p>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to={quoteUrl}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#98E9EF] px-6 py-3.5 text-sm font-bold text-[#071A2F] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Poslat fotografii a poptat návrh <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/reference" className="inline-flex min-h-12 items-center gap-2 border-b border-white/45 px-1 text-sm font-semibold text-white/90 hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Prohlédnout realizace
            </Link>
          </div>
          <p className="mt-5 text-xs leading-5 text-white/55">Zobrazení výrobku a rozměry vždy vycházejí z vybrané katalogové varianty. Vizualizace konkrétního místa se připravuje až po ověření podkladů.</p>
        </div>
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_65%_30%,#FFFFFF_0%,#EDF7FA_55%,#CFDFE5_100%)] lg:min-h-[560px]">
          {image ? (
            <img
              src={image}
              srcSet={responsiveProductSrcSet(image)}
              sizes="(max-width: 1024px) 100vw, 46vw"
              width={1100}
              height={960}
              loading="lazy"
              decoding="async"
              alt={product.image_alt || `Katalogový pohled na mlžítko ${product.name}`}
              className="absolute inset-0 h-full w-full object-contain object-center p-7 sm:p-10 lg:p-12"
            />
          ) : (
            <div className="flex max-w-xs flex-col items-center gap-3 px-8 text-center text-[#3B697C]">
              <MlzidlaIcon className="h-16 w-20 text-[#146179]" />
              <p className="text-sm font-medium">Katalogovou fotografii konkrétní varianty připravujeme.</p>
            </div>
          )}
          <span className="absolute bottom-5 right-5 rounded-lg border border-[#C5DFE7] bg-white/90 px-4 py-2 text-[11px] font-medium text-[#2A5B6F] backdrop-blur-sm">MLŽIDLA.cz · {product.name}</span>
        </div>
      </div>
    </section>
  );
}
