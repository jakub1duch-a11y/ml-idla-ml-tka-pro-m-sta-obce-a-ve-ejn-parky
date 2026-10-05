import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getFamily, getLine } from '@/lib/productFamilies';

export default function PdCompactHero({ product }) {
  const reduced = useReducedMotion();
  const image = product.image_url || (product.hero_visual_verified ? product.hero_product_image_url : '');
  return (
    <header id="prehled" className="relative isolate overflow-hidden bg-[#0D2D38] text-white scroll-mt-24">
      {image && <img src={image} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: product.hero_focal_position || 'center' }} />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07131D]/95 via-[#07131D]/80 to-[#07131D]/35" />
      <motion.div initial={false} whileInView={reduced ? undefined : { y: [12, 0] }} viewport={{ once: true }} transition={{ duration: .6 }} className="mx-auto max-w-[1500px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:py-36">
        <nav aria-label="Drobečková navigace" className="mb-8 flex flex-wrap gap-2 text-sm text-white/80"><Link to="/katalog-mlzitek" className="underline underline-offset-4">Produkty</Link><span>/</span><span>{getFamily(product).label} · {getLine(product).label}</span></nav>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#61D5E5]">MLŽIDLA · návrh pro vaše místo</p>
        <h1 className="mt-4 max-w-4xl break-words font-heading text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">{product.name}</h1>
        {product.short_description && <p className="mt-6 max-w-xl text-base leading-7 text-white/90 sm:text-lg">{product.short_description}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#61D5E5] px-6 py-3 font-bold text-[#07131D]">Získat návrh a cenu <ArrowRight size={18}/></Link>
          <a href="#galerie" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/50 bg-black/20 px-6 py-3 font-semibold">Prohlédnout galerii</a>
        </div>
      </motion.div>
      <nav aria-label="Obsah produktu" className="relative border-t border-white/20 bg-[#0d2d38]/90">
        <div className="mx-auto flex max-w-[1500px] flex-wrap gap-x-6 px-5 sm:px-8 lg:px-12">
          {[['galerie', 'Fotografie a video'], ['parametry', 'Technické parametry'], ['konfigurace', 'Varianty'], ['instalace', 'Instalace'], ['chytre-rizeni', 'Chytré řízení']].map(([id, label], index) => <a key={id} href={'#' + id} className="inline-flex min-h-14 items-center gap-2 text-xs text-white/90 transition-colors hover:text-[#61d5e5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#61d5e5]"><span aria-hidden="true" className="font-mono text-[10px] text-[#61d5e5]">0{index + 1}</span>{label}</a>)}
        </div>
      </nav>
    </header>
  );
}
