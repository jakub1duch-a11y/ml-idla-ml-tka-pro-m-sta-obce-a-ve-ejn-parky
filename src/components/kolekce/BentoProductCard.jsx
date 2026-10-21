import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Gauge, Droplets, ShieldCheck } from 'lucide-react';
import { GATE_MEDIA } from '@/lib/gateMedia';
import ProductHoverImage from '@/components/ui/ProductHoverImage';
import ProductViewMenu from '@/components/produkt/ProductViewMenu';
import { getLine, getFamily } from '@/lib/productFamilies';
import './bento.css';

const VARIANT_CLASS = {
  lg: 'bento-lg is-dark',
  wide: 'bento-wide is-wide',
  tall: 'bento-tall is-mist',
  std: 'bento-std',
};

const materialLabel = (m) => (m.includes('316') ? 'Nerez AISI 316L' : m.includes('304') ? 'Nerez AISI 304' : m);

export default function BentoProductCard({ product, size = 'std', onProductClick }) {
  const line = getLine(product);
  const family = getFamily(product);
  const open = () => onProductClick?.(product);
  const big = size === 'lg' || size === 'wide';
  const chips = [
    product.material && [ShieldCheck, materialLabel(product.material)],
    product.pressure && [Gauge, product.pressure],
    product.water_consumption && [Droplets, product.water_consumption],
  ].filter(Boolean).slice(0, big ? 3 : 1);

  return (
    <article className={`bento-card group ${VARIANT_CLASS[size] || VARIANT_CLASS.std}`}>
      <Link to={`/produkt/${product.slug}`} onClick={open} className="bento-media block" aria-label={product.name}>
        {GATE_MEDIA[product.slug]
          ? <img src={GATE_MEDIA[product.slug]} alt={product.name} loading="lazy" decoding="async" />
          : <ProductHoverImage product={product} className="h-full w-full" fullBleed cleanPreview />}
      </Link>
      <div className="bento-menu" onClick={(e) => e.preventDefault()}><ProductViewMenu product={product} /></div>
      <div className="bento-body">
        <p className="bento-eyebrow">{line.label} · {family.label}</p>
        <h3 className="bento-title"><Link to={`/produkt/${product.slug}`} onClick={open}>{product.name}</Link></h3>
        {big && product.short_description && <p className="bento-desc">{product.short_description}</p>}
        {chips.length > 0 && (
          <div className="bento-meta">
            {chips.map(([Icon, label]) => <span key={label} className="bento-chip"><Icon size={13} strokeWidth={1.6} />{label}</span>)}
          </div>
        )}
        <div className="bento-foot">
          <Link to={`/produkt/${product.slug}`} onClick={open} className="bento-cta">Detail produktu <ArrowRight size={14} /></Link>
          <Link to={`/poptavka?produkt=${product.slug}`} onClick={open} className="bento-quote" aria-label={`Získat návrh a cenu pro ${product.name}`}><ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}