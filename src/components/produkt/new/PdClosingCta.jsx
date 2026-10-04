import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
      <section className="relative overflow-hidden bg-[#0A1628] py-20 lg:py-32">
        <video
          src={VIDEO_ASSETS.loopSquare.src}
          poster={VIDEO_ASSETS.loopSquare.poster}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          autoPlay muted loop playsInline preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/85 to-[#0A1628]/70" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-7 lg:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#22D3EE]">Projektová konzultace</p>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-.02em] text-white lg:text-5xl">
            Získejte návrh a cenu pro váš prostor
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Pro {product.name} připravíme návrh umístění, vhodnou konfiguraci, vizualizaci a cenovou nabídku podle konkrétního místa a způsobu provozu.
          </p>
          <p className="mt-5 text-sm font-medium text-[#9BE8F2]">Stačí poslat fotografii, adresu nebo projektovou situaci.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={`/poptavka?produkt=${product.slug}`}
              className="btn-brand-primary-dark"
            >
              Získat návrh a cenu <ArrowRight size={16} />
            </Link>
            <Link
              to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
              className="btn-brand-outline-dark"
            >
              Vizualizovat v mém prostoru
            </Link>
          </div>
        </div>
      </section>

      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-[#22D3EE]/15 bg-[#0A1628]/95 px-5 py-3 backdrop-blur-md lg:hidden">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-white/40">{product.name}</p>
            <p className="font-heading text-sm font-semibold text-white">Zjistit cenu</p>
          </div>
          <Link
            to={`/poptavka?produkt=${product.slug}`}
            className="bg-[#22D3EE] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#0A1628] transition hover:bg-white"
          >
            Zjistit cenu
          </Link>
        </div>
      )}
    </>
  );
}