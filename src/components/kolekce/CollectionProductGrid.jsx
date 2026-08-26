import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, MapPin, Layers3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

// Zachovává pořadí kolekce přesně podle productSlugs; varianty jednoho produktu
// se přidávají zvlášť přes collection.variantCards a nevytvářejí duplicitní Product záznamy.
const orderProducts = (items, collection) => {
  if (collection.includeAll) return [...items].sort((a, b) => a.slug === collection.lastSlug ? 1 : b.slug === collection.lastSlug ? -1 : a.name.localeCompare(b.name, 'cs'));
  return (collection.productSlugs || []).map((slug) => items.find((item) => item.slug === slug)).filter(Boolean);
};

const getType = (product) => {
  const name = product.name || '';
  if (/back-to-back/i.test(name)) return '360°';
  if (/alej|avenue/i.test(name)) return 'Alej';
  if (/gate|brána/i.test(name)) return 'Gate';
  if (/duo|double|2 stébla/i.test(name)) return 'Duo';
  if (/single/i.test(name)) return 'Single';
  return 'Model';
};

function ProductCard({ product }) {
  const type = getType(product);
  return (
    <Link to={`/produkt/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl">
      <div className="relative bg-[linear-gradient(180deg,#fafbfb_0%,#eef1f2_100%)] p-3 sm:p-4">
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,.045)]">
          <ProductHoverImage product={product} className="aspect-[4/5] bg-white" />
        </div>
        <div className="absolute left-6 top-6 rounded-full border border-black/10 bg-white/94 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-foreground backdrop-blur">{type}</div>
        {product.coverage_area && <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-[11px] text-foreground shadow-sm backdrop-blur"><span className="inline-flex items-center gap-1.5"><Ruler size={13} /> {product.coverage_area}</span><span className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground"><MapPin size={13} /> Katalogový model</span></div>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-secondary">Produkt kolekce</p>
        <h3 className="mt-2 min-h-[3.6rem] line-clamp-2 font-heading text-2xl leading-[1.2] text-foreground">{product.name}</h3>
        <p className="mt-3 min-h-[2.75rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
        <span className="btn-secondary-outline mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-colors group-hover:border-secondary group-hover:text-secondary">Detail produktu <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}

function VariantCard({ variant }) {
  const href = `/produkt/${variant.slug}?variant=${encodeURIComponent(variant.variant)}`;
  return (
    <Link to={href} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#0b4860]/20 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0b4860]/45 hover:shadow-xl">
      <div className="relative bg-[linear-gradient(180deg,#f8fbfb_0%,#edf3f4_100%)] p-3 sm:p-4">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/80 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,.045)]">
          <img src={variant.image} alt={`${variant.label} – katalogový náhled varianty`} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" loading="lazy" />
        </div>
        <div className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-[#0b4860] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-white"><Layers3 size={12}/> Varianta</div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b4860]/65">Varianta stejného produktu</p>
        <h3 className="mt-2 font-heading text-2xl leading-[1.2] text-foreground">{variant.label}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{variant.sub}</p>
        <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#0b4860]/20 px-5 py-2.5 text-sm font-semibold text-[#0b4860] transition-colors group-hover:bg-[#0b4860] group-hover:text-white">Zobrazit variantu <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}

export default function CollectionProductGrid({ collection }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts([]);
    base44.entities.Product.list().then((items) => setProducts(orderProducts(items || [], collection))).catch(() => setProducts([]));
  }, [collection]);

  const variantCards = collection.variantCards || [];
  if (!products.length && !variantCards.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 flex items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Produkty a varianty kolekce</p>
          <h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">{collection.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Každá karta jasně rozlišuje samostatný produkt od tvarové varianty stejného produktu. Katalogový náhled používá vyšší formát, aby byla dobře čitelná celá geometrie.</p>
        </div>
        <Link to="/mlzidla-mlzitka" className="btn-secondary-outline hidden rounded-full px-6 py-3 text-sm font-semibold text-foreground sm:inline-flex">Celý katalog <ArrowRight size={15} /></Link>
      </div>

      <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
        {variantCards.map((variant) => <VariantCard key={`${variant.slug}-${variant.variant}`} variant={variant} />)}
      </div>

      <div className="mt-7 sm:hidden"><Link to="/mlzidla-mlzitka" className="btn-secondary-outline inline-flex rounded-full px-6 py-3 text-sm font-semibold text-foreground">Celý katalog <ArrowRight size={15} /></Link></div>
    </section>
  );
}
