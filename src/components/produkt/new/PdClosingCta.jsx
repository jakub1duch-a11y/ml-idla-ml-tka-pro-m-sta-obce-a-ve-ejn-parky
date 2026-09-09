import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VIDEO_ASSETS } from '@/lib/newMedia';

export default function PdClosingCta({ product }) {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-[#0D2F4F] py-24 lg:py-32">
        <video
          src={VIDEO_ASSETS.loopSquare.src}
          poster={VIDEO_ASSETS.loopSquare.poster}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          autoPlay muted loop playsInline preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2F4F] via-[#0D2F4F]/80 to-[#0D2F4F]/60" />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
          <h2 className="font-heading text-3xl leading-tight text-white lg:text-5xl">Poptat {product.name}</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
            Připravíme návrh vhodného osazení, vizualizaci v konkrétním prostoru a cenovou nabídku podle zadání projektu.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/15">Nahrát fotografii prostoru</Link>
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex items-center gap-2 bg-[#0B5EA8] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]">Poptat {product.name}</Link>
          </div>
        </div>
      </section>

      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-[#0B5EA8]/15 bg-white/95 px-6 py-3 backdrop-blur-md lg:hidden">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/45">{product.name}</p>
            {product.price_from ? (
              <p className="font-heading text-sm font-bold text-[#0D2F4F]">od {product.price_from.toLocaleString('cs-CZ')} Kč bez DPH</p>
            ) : (
              <p className="font-heading text-sm font-bold text-[#0D2F4F]">projektová cena</p>
            )}
          </div>
          <Link
            to={`/poptavka?produkt=${product.slug}`}
            className="bg-[#0B5EA8] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
          >
            Poptat
          </Link>
        </div>
      )}
    </>
  );
}