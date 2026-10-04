import React, { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Images, LayoutGrid } from 'lucide-react';
import { getOptimizedMediaUrl, getOriginalMediaUrl } from '@/lib/optimizedMedia';
import './ProductExperience.css';

const isVideo = (url) => /\.(mp4|webm|mov|m4v)([?#]|$)/i.test(url || '');
const usable = (url) => typeof url === 'string' && !!url.trim() && !/^\/media\/(studio|products)\//.test(url);
const identity = (product) => product.slug || product.id || product.name;

function ProductImage({ url, name, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return <div className={`mpe-image-empty ${className}`}>Fotografie se připravuje</div>;
  return <img src={getOptimizedMediaUrl(url)} alt={name} className={className} loading="lazy" decoding="async"
    onError={(event) => {
      const original = getOriginalMediaUrl(url);
      if (original && event.currentTarget.getAttribute('src') !== original) event.currentTarget.src = original;
      else setFailed(true);
    }} />;
}

function ProductStage({ product, reduced }) {
  const [view, setView] = useState(0);
  const urls = [...new Set([product.image_url, ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : [])].filter(usable))];
  if (usable(product.video_url) && isVideo(product.video_url) && !urls.includes(product.video_url)) urls.push(product.video_url);
  const media = urls[view] || urls[0];
  const mediaIsVideo = isVideo(media);
  const touch = useRef(null);
  return <>
    <div className="mpe-stage" onTouchStart={(event) => {
      touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }} onTouchEnd={(event) => {
      if (!touch.current || mediaIsVideo || event.target.closest('button')) return;
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      if (urls.length > 1 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5)
        setView((current) => (current + (dx < 0 ? 1 : -1) + urls.length) % urls.length);
      touch.current = null;
    }}>
      <span className="mpe-stage-label">{mediaIsVideo ? 'Video produktu' : 'Galerie produktu'}</span>
      <motion.div key={media || 'empty'} className="mpe-media"
        initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.35 }}>
        {mediaIsVideo
          ? <video src={getOptimizedMediaUrl(media)} controls playsInline preload="none"
              aria-label={`${product.name} — video produktu`} />
          : <ProductImage key={media} url={media} name={`${product.name} — fotografie ${view + 1}`} />}
      </motion.div>
      {urls.length > 1 && <div className="mpe-photo-controls" aria-label={`Fotografie: ${product.name}`}>
        {urls.map((url, index) => <button type="button" key={url}
          aria-label={`${isVideo(url) ? 'Video' : 'Fotografie'} ${index + 1} — ${product.name}`}
          aria-pressed={index === view} onClick={() => setView(index)}>
          <span>{isVideo(url) ? '▶' : index + 1}</span>
        </button>)}
      </div>}
    </div>
    <div className="mpe-story">
      <p className="mpe-eyebrow">Osvěžení má svůj tvar</p>
      <h3>{product.name}</h3>
      {product.short_description && <p className="mpe-description">{product.short_description}</p>}
      <p className="mpe-invitation">Představte si jemnou mlhu právě ve vašem prostoru.</p>
      <div className="mpe-actions">
        {product.slug && <Link className="mpe-primary" to={`/produkt/${encodeURIComponent(product.slug)}`}>
          Prohlédnout produkt <ArrowRight size={17} aria-hidden="true" />
        </Link>}
        <Link className="mpe-secondary" to={product.slug ? `/poptavka?produkt=${encodeURIComponent(product.slug)}` : '/poptavka'}>
          Navrhnout pro můj prostor
        </Link>
      </div>
    </div>
  </>;
}

/** Uses the same filtered records as the card view; never invents product media or attributes. */
export default function ProductExperience({ products = [], children }) {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('gallery');
  const reduced = useReducedMotion();
  const regionId = useId();
  const index = Math.max(0, products.findIndex((product) => identity(product) === selected));
  const product = products[index];
  if (!product) return children || <p className="mpe-empty" role="status">V tomto výběru zatím nejsou produkty.</p>;
  const move = (step) => setSelected(identity(products[(index + step + products.length) % products.length]));
  return <div className="mpe" data-product-experience>
    <div className="mpe-toolbar">
      <p>Objevte jednotlivé tvary</p>
      {children && <div className="mpe-modes" aria-label="Zobrazení produktů">
        <button type="button" aria-pressed={mode === 'gallery'} aria-controls={regionId} onClick={() => setMode('gallery')}>
          <Images size={16} aria-hidden="true" /> Galerie
        </button>
        <button type="button" aria-pressed={mode === 'grid'} aria-controls={regionId} onClick={() => setMode('grid')}>
          <LayoutGrid size={16} aria-hidden="true" /> Přehled
        </button>
      </div>}
    </div>
    <div id={regionId}>
      {mode === 'grid' ? children : <div role="region" aria-roledescription="karusel" aria-label="Galerie produktů">
        <div className="mpe-feature">
          <ProductStage key={identity(product)} product={product} reduced={reduced} />
        </div>
        <div className="mpe-navigation">
          <p role="status" aria-live="polite" aria-atomic="true"><span>{String(index + 1).padStart(2, '0')}</span> / {products.length} · {product.name}</p>
          {products.length > 1 && <div className="mpe-arrows">
            <button type="button" aria-label="Předchozí produkt" onClick={() => move(-1)}><ArrowLeft size={20} /></button>
            <button type="button" aria-label="Další produkt" onClick={() => move(1)}><ArrowRight size={20} /></button>
          </div>}
        </div>
        {products.length > 1 && <div className="mpe-thumbnails" aria-label="Výběr produktu">
          {products.map((item, itemIndex) => <button type="button" key={identity(item)}
            aria-pressed={index === itemIndex} onClick={() => setSelected(identity(item))}>
            <ProductImage key={item.image_url} url={item.image_url} name="" />
            <span>{item.name}</span>
          </button>)}
        </div>}
      </div>}
    </div>
  </div>;
}
