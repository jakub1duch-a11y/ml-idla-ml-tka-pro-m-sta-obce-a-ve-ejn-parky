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

const PRODUCT_VARIANTS = {
  'mlzitko-bendy': [
    { label: 'Single', href: '/produkt/mlzitko-bendy' },
    { label: 'Radius S', href: '/produkt/bendy-radius-s' },
    { label: 'Radius M', href: '/produkt/bendy-radius-m' },
    { label: 'Radius L', href: '/produkt/bendy-radius-l' },
    { label: 'Field', href: '/produkt/bendy-field' },
  ],
  'bendy-radius-s': [
    { label: 'Single', href: '/produkt/mlzitko-bendy' },
    { label: 'Radius M', href: '/produkt/bendy-radius-m' },
    { label: 'Radius L', href: '/produkt/bendy-radius-l' },
    { label: 'Field', href: '/produkt/bendy-field' },
  ],
  'bendy-radius-m': [
    { label: 'Single', href: '/produkt/mlzitko-bendy' },
    { label: 'Radius S', href: '/produkt/bendy-radius-s' },
    { label: 'Radius L', href: '/produkt/bendy-radius-l' },
    { label: 'Field', href: '/produkt/bendy-field' },
  ],
  'bendy-radius-l': [
    { label: 'Single', href: '/produkt/mlzitko-bendy' },
    { label: 'Radius S', href: '/produkt/bendy-radius-s' },
    { label: 'Radius M', href: '/produkt/bendy-radius-m' },
    { label: 'Field', href: '/produkt/bendy-field' },
  ],
  'bendy-field': [
    { label: 'Single', href: '/produkt/mlzitko-bendy' },
    { label: 'Radius S', href: '/produkt/bendy-radius-s' },
    { label: 'Radius M', href: '/produkt/bendy-radius-m' },
    { label: 'Radius L', href: '/produkt/bendy-radius-l' },
  ],
  'mlzitko-mrak': [
    { label: 'Classic', href: '/produkt/mlzitko-mrak' },
    { label: 'Play', href: '/produkt/mlzitko-mrak?variant=play' },
  ],
  'mlzna-brana-gate': [
    { label: 'Straight', href: '/produkt/mlzna-brana-gate?variant=straight' },
    { label: 'V', href: '/produkt/mlzna-brana-gate?variant=v' },
  ],
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

const getFamily = (product) => {
  const slug = product.slug || '';
  if (slug === 'mlzitko-bendy') return 'BENDY®';
  if (['mlzitko-steblo', 'mlzitko-2-stebla', 'brana-bendy', 'bendy-back-to-back', 'bendy-alej'].includes(slug)) return 'STÉBLO®';
  if (slug === 'mlzitko-mrak') return 'MLŽNÝ MRAK®';
  if (slug === 'mlzna-brana-gate') return 'GATE®';
  return null;
};

function ProductCard({ product }) {
  const type = getType(product);
  const family = getFamily(product);
  const variants = PRODUCT_VARIANTS[product.slug] || [];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl">
      <Link to={`/produkt/${product.slug}`} className="block">
      <div className="relative bg-[linear-gradient(180deg,#fafbfb_0%,#eef1f2_100%)] p-3 sm:p-4">
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,.045)]">
          <ProductHoverImage product={product} className="aspect-[4/5] bg-white" />
        </div>
        <div className="absolute left-6 top-6 rounded-full border border-black/10 bg-white/94 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-foreground backdrop-blur">{type}</div>
        {product.coverage_area && <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-[11px] text-foreground shadow-sm backdrop-blur"><span className="inline-flex items-center gap-1.5"><Ruler size={13} /> {product.coverage_area}</span><span className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground"><MapPin size={13} /> Katalogový model</span></div>}
      </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-secondary">{family || 'Produkt kolekce'}</p>
          {variants.length > 0 && <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">{variants.length} variant</span>}
        </div>
        <h3 className="mt-2 min-h-[3.6rem] line-clamp-2 font-heading text-2xl leading-[1.2] text-foreground">{product.name}</h3>
        <p className="mt-3 min-h-[2.75rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
        {variants.length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[.15em] text-slate-400">Rychlá volba varianty</p><div className="flex flex-wrap gap-2">{variants.map((variant) => <Link key={variant.href} to={variant.href} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-[#0b4860]/30 hover:bg-[#0b4860]/5 hover:text-[#0b4860]">{variant.label}</Link>)}</div></div>}
        <Link to={`/produkt/${product.slug}`} className="btn-secondary-outline mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground transition-colors group-hover:border-secondary group-hover:text-secondary">Detail produktu <ArrowRight size={15} /></Link>
      </div>
    </article>
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

      {products.length > 0 && <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>}

      {variantCards.length > 0 && <div className={`${products.length ? 'mt-10' : ''} rounded-[2rem] border border-slate-200 bg-slate-50/70 p-4 sm:p-6 lg:p-8`}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b4860]/65">Varianty stejného produktu</p>
            <h3 className="mt-2 font-heading text-2xl text-foreground sm:text-3xl">Vyberte geometrii, která odpovídá prostoru.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Varianty nejsou vedené jako další samostatné produkty. Zachovávají produktovou rodinu a mění pouze definovanou geometrii nebo konfiguraci.</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500">{variantCards.length} variant</span>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {variantCards.map((variant) => <VariantCard key={`${variant.slug}-${variant.variant}`} variant={variant} />)}
        </div>
      </div>}

      <div className="mt-7 sm:hidden"><Link to="/mlzidla-mlzitka" className="btn-secondary-outline inline-flex rounded-full px-6 py-3 text-sm font-semibold text-foreground">Celý katalog <ArrowRight size={15} /></Link></div>
    </section>
  );
}
