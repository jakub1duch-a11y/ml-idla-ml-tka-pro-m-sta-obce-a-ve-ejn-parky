import ProductExperience from '@/components/ui/ProductExperience';
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, MapPin, Layers3 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { normalizeProductMedia } from '@/lib/optimizedMedia';
import { isPublicCatalogProduct } from '@/lib/publicCatalogProducts';
import ProductHoverImage from '@/components/ui/ProductHoverImage';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';

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
    { label: 'Obrys', href: '/produkt/mlzitko-mrak?variant=obrys' },
    { label: 'Flow', href: '/produkt/mlzitko-mrak?variant=flow' },
    { label: 'Organik', href: '/produkt/mlzitko-mrak?variant=organik' },
    { label: 'Play', href: '/produkt/mlzitko-mrak?variant=play' },
  ],
  'mlzna-brana-gate': [
    { label: 'Straight', href: '/produkt/mlzna-brana-gate?variant=straight' },
    { label: 'V', href: '/produkt/mlzna-brana-gate?variant=v' },
  ],
};

const getType = (product) => {
  const name = product.name || '';
  if (/radius s/i.test(name)) return 'Radius S';
  if (/radius m/i.test(name)) return 'Radius M';
  if (/radius l/i.test(name)) return 'Radius L';
  if (/\bfield\b/i.test(name)) return 'Field';
  if (/back-to-back/i.test(name)) return '360°';
  if (/alej|avenue/i.test(name)) return 'Alej';
  if (/gate|brána/i.test(name)) return 'Gate';
  if (/duo|double|2 stébla/i.test(name)) return 'Duo';
  if (/single/i.test(name)) return 'Single';
  return 'Model';
};

const getFamily = (product) => {
  const slug = product.slug || '';
  if (['mlzitko-bendy', 'bendy-radius-s', 'bendy-radius-m', 'bendy-radius-l', 'bendy-field'].includes(slug)) return 'BENDY®';
  if (['mlzitko-steblo', 'mlzitko-2-stebla', 'brana-bendy', 'bendy-back-to-back', 'bendy-alej'].includes(slug)) return 'STÉBLO®';
  if (slug === 'mlzitko-mrak') return 'MLŽNÝ MRAK®';
  if (slug === 'mlzna-brana-gate') return 'GATE®';
  return null;
};

function ProductCard({ product }) {
  return <CatalogProductCard product={product} />;
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
    base44.entities.Product.list().then((items) => setProducts(orderProducts((items || []).filter(isPublicCatalogProduct).map(normalizeProductMedia), collection))).catch(() => setProducts([]));
  }, [collection]);

  const variantCards = [];
  if (!products.length && !variantCards.length) return null;

  return (
    <section className="catalog-pattern relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
      <div className="mb-10 flex items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Produkty kolekce</p>
          <h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">{collection.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Přehled samostatných produktů kolekce. Každý produkt má vlastní detail, technické informace a možnost poptávky.</p>
        </div>
        <Link to="/mlzidla-mlzitka" className="catalog-sweep btn-secondary-outline hidden rounded-full px-6 py-3 text-sm font-semibold text-foreground sm:inline-flex">Celý katalog <ArrowRight size={15} /></Link>
      </div>

      {products.length > 0 && <ProductExperience products={products}>
<div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
</ProductExperience>}

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

      <div className="mt-7 sm:hidden"><Link to="/mlzidla-mlzitka" className="catalog-sweep btn-secondary-outline inline-flex rounded-full px-6 py-3 text-sm font-semibold text-foreground">Celý katalog <ArrowRight size={15} /></Link></div>
    </section>
  );
}
