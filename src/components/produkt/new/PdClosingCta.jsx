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
      <section className="relative overflow-hidden py-20 lg:py-32 bg-[#0a1628]/[0.7]">
        <video
          src={VIDEO_ASSETS.loopSquare.src}
          poster={VIDEO_ASSETS.loopSquare.poster}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          autoPlay muted loop playsInline preload="metadata" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/85 to-[#0A1628]/70" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-7 lg:px-10">
          <p className="font-mono uppercase tracking-[.18em] text-base text-[hsl(var(--background))]">Projektová konzultace</p>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-.02em] text-white lg:text-5xl">
            Získejte návrh a cenu pro váš prostor
          </h2>
          

          
          <p className="mt-5 font-medium text-base text-[hsl(var(--ring))]">Stačí poslat fotografii, adresu nebo projektovou situaci.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={`/poptavka?produkt=${product.slug}`}
              className="btn-brand-primary-dark">
              
              Získat návrh a cenu <ArrowRight size={16} />
            </Link>
            <Link
              to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
              className="btn-brand-outline-dark">
              
              Vizualizovat v mém prostoru
            </Link>
          </div>
        </div>
      </section>

      












      
    </>);

}