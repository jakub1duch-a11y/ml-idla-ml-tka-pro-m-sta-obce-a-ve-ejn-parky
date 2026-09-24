import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Gauge, Droplets, Sparkles } from 'lucide-react';
import ProductHoverImage from '@/components/ui/ProductHoverImage';
import { getLine, getFamily } from '@/lib/productFamilies';

export default function CatalogProductCard({ product }) {
  const reduced = useReducedMotion();
  const line = getLine(product);
  const family = getFamily(product);
  const specs = [
    product.material && [ShieldCheck, product.material.includes('316') ? 'Nerez AISI 316L' : product.material.includes('304') ? 'Nerez AISI 304' : product.material],
    product.pressure && [Gauge, product.pressure],
    product.water_consumption && [Droplets, product.water_consumption],
  ].filter(Boolean).slice(0, 2);

  return (
    <motion.article initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} whileHover={reduced ? undefined : { y: -7 }} whileTap={reduced ? undefined : { scale: 0.992 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} className="catalog-glass-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#D8E7EC] bg-white/90 shadow-[0_18px_60px_rgba(7,19,29,.07)] backdrop-blur-xl">
      <Link to={`/produkt/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_72%_22%,#FFFFFF_0%,#EDF8FA_45%,#DCEFF3_100%)] after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:-skew-x-12 after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent after:opacity-0 after:transition-all after:duration-700 group-hover:after:left-[120%] group-hover:after:opacity-100">
        <ProductHoverImage product={product} className="h-full w-full" fullBleed />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07131D]/10 via-transparent to-white/15 opacity-70" />
        <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[#0B6680] shadow-sm backdrop-blur-xl">{line.label}</span>
        {product.featured && <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#07131D] px-3 py-1.5 font-mono text-[10px] tracking-[.14em] text-white"><Sparkles size={11} className="text-[#7AE1EF]" /> VÝBĚR</span>}
        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/90 text-[#07131D] opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0B8EC5]">{family.label}</div>
        <h3 className="mt-2 font-heading text-[1.55rem] font-bold leading-[1.05] tracking-[-.04em] text-[#07131D]"><Link to={`/produkt/${product.slug}`}>{product.name}</Link></h3>
        <p className="mt-3 line-clamp-2 min-h-[48px] text-sm leading-6 text-[#5A6B78]">{product.short_description}</p>
        {specs.length > 0 && (
          <ul className="mb-5 mt-5 grid gap-2 border-t border-[#E0EBEF] pt-4 text-[12.5px] text-[#5A6B78]">
            {specs.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2"><Icon size={14} strokeWidth={1.5} className="shrink-0 text-[#153863]" /><span className="truncate">{text}</span></li>
            ))}
          </ul>
        )}
        <div className="mt-auto grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[#E0EBEF] pt-4">
          <Link to={`/produkt/${product.slug}`} className="text-sm font-bold text-[#07131D] transition group-hover:text-[#0B8EC5]">Detail produktu</Link>
          <Link to={`/poptavka?produkt=${product.slug}`} aria-label={`Získat návrh a cenu pro ${product.name}`} className="catalog-sweep inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#DDF7FA] text-[#075D70] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#07131D] hover:text-white"><ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </motion.article>
  );
}