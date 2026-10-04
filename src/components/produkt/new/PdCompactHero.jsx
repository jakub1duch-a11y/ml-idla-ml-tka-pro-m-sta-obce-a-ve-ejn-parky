import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFamily, getLine } from '@/lib/productFamilies';

export default function PdCompactHero({ product }) {
  const image = product.image_url || (product.hero_visual_verified ? product.hero_product_image_url : '');
  return (
    <header id="prehled" className="relative isolate overflow-hidden bg-[#0D2D38] text-white scroll-mt-24">
      {image && <img src={image} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: product.hero_focal_position || 'center' }} />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07131D]/95 via-[#07131D]/80 to-[#07131D]/35" />
      <div className="mx-auto max-w-[1500px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:py-36">
        <nav aria-label="Drobečková navigace" className="mb-8 flex flex-wrap gap-2 text-sm text-white/80"><Link to="/katalog-mlzitek" className="underline underline-offset-4">Produkty</Link><span>/</span><span>{getFamily(product).label} · {getLine(product).label}</span></nav>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#61D5E5]">MLŽIDLA · návrh pro vaše místo</p>
        <h1 className="mt-4 max-w-4xl break-words font-heading text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">{product.name}</h1>
        {product.short_description && <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">{product.short_description}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#61D5E5] px-6 py-3 font-bold text-[#07131D]">Získat návrh a cenu <ArrowRight size={18}/></Link>
          <a href="#galerie" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/50 bg-black/20 px-6 py-3 font-semibold">Prohlédnout galerii</a>
        </div>
      </div>
    </header>
  );
}
