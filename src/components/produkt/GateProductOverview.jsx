import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, ImageOff } from 'lucide-react';
import MotionHeading from '@/components/motion/MotionHeading';
import { GATE_GROUPS } from '@/lib/gateCatalog';

function GateProductCard({ product }) {
  const [failedImage, setFailedImage] = useState(null);
  return <article className="gate-product-card" data-product={product.id}>
    <Link to={product.detailUrl} className="gate-card-image" aria-label={`Prohlédnout ${product.name}`}>
      {product.image && failedImage !== product.image ? <img src={product.image} alt={`${product.name} — ${product.caption}`} width="960" height="640" loading="lazy" decoding="async" onError={() => setFailedImage(product.image)} /> : <span className="gate-image-fallback"><ImageOff size={32} aria-hidden="true" /><span>{product.name}</span></span>}
      <span className="gate-card-tag">{product.group === 'standalone' ? 'Samostojící mlžítko' : product.group === 'portal' ? 'Vstupní portál' : 'Brána GATE'}</span>
    </Link>
    <div className="gate-card-body"><p className="gate-eyebrow">{product.caption}</p><h3><Link to={product.detailUrl}>{product.name}</Link></h3><p className="gate-card-description">{product.text}</p>
      <div className="gate-card-actions"><Link to={product.detailUrl}>Detail produktu <ArrowRight size={17} aria-hidden="true" /></Link><Link to={product.quoteUrl} aria-label={`Poptat ${product.name}`} className="bg-[hsl(var(--ring))]">Poptat</Link></div>
    </div>
  </article>;
}

export default function GateProductOverview({ products, loading, error, onRetry, id = 'produkty' }) {
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? products : products.filter((p) => p.group === filter);
  return <section id={id} className="gate-shell gate-section" aria-labelledby={`${id}-title`}>
    <div className="gate-section-heading"><div><p className="gate-eyebrow">Kompletní přehled produktů</p><MotionHeading id={`${id}-title`}>Vyberte si svůj průchod mlhou.</MotionHeading></div><p>Brány GATE, vstupní portály i samostojící TEEPEE. Prohlédněte si jednotlivé tvary a vyberte řešení pro své místo.</p></div>
    <div className="gate-filters" role="group" aria-label="Filtrovat produkty">{GATE_GROUPS.map(({ id, label }) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}<span>{id === 'all' ? products.length : products.filter((p) => p.group === id).length}</span></button>)}</div>
    {loading ? <div role="status" className="gate-feedback">Načítáme nabídku produktů…</div> : error ? <div role="alert" className="gate-feedback"><p>Nabídku se nepodařilo načíst. Zkuste to prosím znovu.</p><button type="button" onClick={onRetry}><RefreshCw size={17} aria-hidden="true" /> Načíst znovu</button></div> : <>
      <p className="gate-result-count" role="status" aria-live="polite">{visible.length} z {products.length} produktů a variant</p>
      {visible.length ? <div className="gate-product-grid">{visible.map((product) => <GateProductCard key={product.id} product={product} />)}</div> : <div className="gate-feedback"><p>V této kategorii nyní nejsou dostupné produkty.</p>{filter !== 'all' && <button type="button" onClick={() => setFilter('all')}>Zobrazit všechny produkty</button>}</div>}
    </>}
  </section>;
}