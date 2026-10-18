import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, X, Droplets } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getCuratedProductMedia } from '@/lib/curatedProductMedia';
import { getOptimizedMediaUrl } from '@/lib/optimizedMedia';
import './PdVisualGalleryCompact.css';

const VIDEO_RE = /\.(mp4|webm|mov|m4v)([?#]|$)/i;
const TECH_RE = /(technick|schema|schéma|vykres|výkres|montaz|montáž|edraw)/i;
const isImage = (url = '') => typeof url === 'string' && !!url.trim() && !VIDEO_RE.test(url) && !TECH_RE.test(url);
const optimize = (url) => isImage(url) ? getOptimizedMediaUrl(url) : url;
const dedupe = (items) => [...new Map(items.filter((item) => item && item.url).map((item) => [optimize(item.url.trim()), item])).values()];
const clampIndex = (value, length) => Math.min(Math.max(value, 0), Math.max(0, length - 1));

function Fullscreen({ items, index, onClose, onChange, productName, reduced }) {
  const item = items[index];
  const touchStart = useRef(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight') onChange((index + 1) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onChange, onClose]);

  if (!item) return null;
  return (
    <div className="pdpc-lightbox" role="dialog" aria-modal="true" aria-label={'Galerie produktu ' + productName}
      onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={(event) => {
        if (!touchStart.current || items.length < 2) return;
        const dx = event.changedTouches[0].clientX - touchStart.current.x;
        const dy = event.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) onChange((index + (dx < 0 ? 1 : -1) + items.length) % items.length);
        touchStart.current = null;
      }}>
      <button type="button" onClick={onClose} aria-label="Zavřít galerii" className="pdpc-lightbox-close"><X size={20} /></button>
      <div className="pdpc-lightbox-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img key={item.url} src={optimize(item.url)} alt={item.alt || (productName + ' — ' + (item.title || ('fotografie ' + (index + 1))))}
            className="pdpc-lightbox-image"
            initial={reduced ? false : { opacity: 0, scale: 0.99, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99, x: -10 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }} />
        </AnimatePresence>
        {items.length > 1 && <>
          <button type="button" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Předchozí fotografie" className="pdpc-lightbox-arrow is-left"><ChevronLeft size={22} /></button>
          <button type="button" onClick={() => onChange((index + 1) % items.length)} aria-label="Další fotografie" className="pdpc-lightbox-arrow is-right"><ChevronRight size={22} /></button>
        </>}
        <div className="pdpc-lightbox-caption">
          <span>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <strong>{item.title || productName}</strong>
          {item.caption && <small>{item.caption}</small>}
        </div>
      </div>
    </div>
  );
}

function GalleryImage({ item, index, productName, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setLoaded(false); setFailed(false); }, [item.url]);
  return (
    <button type="button" className="pdpc-image-open" onClick={onOpen} aria-label={'Zvětšit fotografii ' + (index + 1) + ': ' + productName}>
      {!loaded && !failed && <span className="pdpc-image-loading" aria-hidden="true"><span className="pdpc-loading-mark"><Droplets size={21} /></span><span className="pdpc-loading-line" /></span>}
      {!failed ? <img src={optimize(item.url)} alt={item.alt || (productName + ' — ' + (item.title || ('fotografie ' + (index + 1))))}
        className={'pdpc-image ' + (item.fit === 'cover' ? 'is-cover' : 'is-contain') + (loaded ? ' is-loaded' : '')}
        loading={index === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)} onError={() => setFailed(true)} /> :
        <span className="pdpc-image-fallback">Tento snímek nyní není dostupný.</span>}
    </button>
  );
}

export default function PdVisualGalleryCompact({ product }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const galleryRef = useRef(null);
  const swipe = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let active = true;
    setMediaFiles([]);
    setActiveIndex(0);
    setLightbox(null);
    setAutoPlay(!reduced);
    base44.entities.MediaFile.filter({ product_slug: product.slug }, '-sort_order', 100)
      .then((items = []) => { if (active) setMediaFiles(items || []); })
      .catch(() => { if (active) setMediaFiles([]); });
    return () => { active = false; };
  }, [product.slug, reduced]);

  const items = useMemo(() => {
    const admin = mediaFiles
      .filter((item) => ['hero', 'gallery', 'detail', 'reference', 'realization', 'render'].includes(item.media_role))
      .filter((item) => isImage(item.file_url))
      .map((item) => {
        const role = item.media_role;
        const label = role === 'realization' ? 'V prostoru' : role === 'render' ? 'Produkt' : role === 'detail' ? 'Detail' : role === 'reference' ? 'Použití' : role === 'hero' ? 'Hlavní pohled' : 'Galerie';
        return {
          url: item.file_url,
          title: label === 'V prostoru' ? product.name + ' — v prostoru' : product.name + ' — ' + label.toLowerCase(),
          caption: role === 'realization' ? 'Pohled na řešení v okolním prostoru' : role === 'render' ? 'Čistý pohled na konstrukci a proporce' : role === 'detail' ? 'Materiál, spoje a drobné konstrukční prvky' : role === 'reference' ? 'Jak produkt působí v prostředí' : 'Fotografie konkrétního produktu',
          badge: label,
          fit: ['realization', 'reference'].includes(role) ? 'cover' : 'contain',
          alt: product.name + ' — ' + label.toLowerCase()
        };
      });

    const curated = getCuratedProductMedia(product)
      .filter((item) => isImage(item.url))
      .map((item) => ({
        url: item.url,
        title: item.title || (product.name + ' — fotografie'),
        caption: item.caption || (item.kind === 'visualization' ? 'Pohled na produkt v prostředí' : 'Produktový detail'),
        badge: item.kind === 'visualization' ? 'V prostoru' : 'Produkt',
        fit: item.kind === 'visualization' ? 'cover' : 'contain',
        alt: item.alt || (product.name + ' — ' + (item.title || 'fotografie produktu'))
      }));

    const productItems = [
      product.hero_visual_verified && isImage(product.hero_product_image_url) && {
        url: product.hero_product_image_url,
        title: product.name + ' — produkt',
        caption: 'Referenční pohled na skutečný produkt',
        badge: 'Produkt',
        fit: 'contain',
        alt: product.name + ' — produktový pohled'
      },
      isImage(product.image_url) && {
        url: product.image_url,
        title: product.name + ' — hlavní fotografie',
        caption: 'Hlavní pohled na produkt',
        badge: 'Produkt',
        fit: 'contain',
        alt: product.name + ' — hlavní fotografie'
      },
      ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : []).filter(isImage).map((url, index) => ({
        url,
        title: product.name + ' — fotografie ' + (index + 1),
        caption: 'Produkt, detaily a provedení',
        badge: 'Galerie',
        fit: 'contain',
        alt: product.name + ' — fotografie ' + (index + 1)
      }))
    ].filter(Boolean);

    return dedupe([...admin, ...curated, ...productItems]).slice(0, 12);
  }, [mediaFiles, product]);

  useEffect(() => { setActiveIndex((index) => clampIndex(index, items.length)); }, [items.length]);

  const goTo = useCallback((index) => {
    setActiveIndex(clampIndex(index, items.length));
  }, [items.length]);

  const move = useCallback((step) => {
    if (items.length < 2) return;
    setActiveIndex((current) => (current + step + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const node = galleryRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setInView(entry.isIntersecting));
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [product.slug]);

  useEffect(() => {
    if (!autoPlay || !inView || reduced || hovered || focused || lightbox !== null || items.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % items.length), 3600);
    return () => window.clearInterval(timer);
  }, [autoPlay, inView, reduced, hovered, focused, lightbox, items.length]);

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) setAutoPlay(false); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (!items.length) return null;
  const index = clampIndex(activeIndex, items.length);
  const item = items[index];

  return (
    <section id="galerie" className="pdpc-section" aria-label={'Fotogalerie produktu ' + product.name}>
      <div className="pdpc-container">
        <motion.div className="pdpc-heading" initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
          <div>
            <p className="pdpc-eyebrow">Galerie produktu</p>
            <h2>Tvar. Detail. Reálný prostor.</h2>
          </div>
          <p className="pdpc-intro">Velké fotografie, jemné přechody a rychlý přístup ke každému pohledu na konkrétní produkt.</p>
        </motion.div>

        <motion.div ref={galleryRef} className="pdpc-gallery" data-reduced={reduced ? 'true' : 'false'}
          data-autoplay={autoPlay && !reduced ? 'true' : 'false'}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
          onTouchStart={(event) => { swipe.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={(event) => {
            if (!swipe.current || items.length < 2) return;
            const dx = event.changedTouches[0].clientX - swipe.current.x;
            const dy = event.changedTouches[0].clientY - swipe.current.y;
            if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
            swipe.current = null;
          }}>
          <div className="pdpc-main-frame">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={item.url} className="pdpc-slide"
                initial={reduced ? false : { opacity: 0, x: 22, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: -18, scale: 0.995 }}
                transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}>
                <GalleryImage item={item} index={index} productName={product.name} onOpen={() => setLightbox(index)} />
              </motion.div>
            </AnimatePresence>
            {items.length > 1 && <>
              <button type="button" className="pdpc-arrow pdpc-arrow-left" aria-label="Předchozí fotografie" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
              <button type="button" className="pdpc-arrow pdpc-arrow-right" aria-label="Další fotografie" onClick={() => move(1)}><ChevronRight size={20} /></button>
            </>}
            <div className="pdpc-counter" aria-live="polite" aria-atomic="true">
              {String(index + 1).padStart(2, '0')} <span>/</span> {String(items.length).padStart(2, '0')}
            </div>
            {items.length > 1 && autoPlay && !reduced && !hovered && !focused && <div key={item.url} className="pdpc-timer"><span /></div>}
          </div>

          <div className="pdpc-caption-row">
            <div className="pdpc-caption">
              <span>{item.badge || 'Produkt'}</span>
              <strong>{item.title || product.name}</strong>
              {item.caption && <p>{item.caption}</p>}
            </div>
            <div className="pdpc-controls">
              {items.length > 1 && <button type="button" onClick={() => setAutoPlay((value) => !value)} aria-pressed={autoPlay && !reduced}
                aria-label={autoPlay && !reduced ? 'Zastavit automatické přehrávání' : 'Spustit automatické přehrávání'} className="pdpc-play">
                {autoPlay && !reduced ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
                <span>{autoPlay && !reduced ? 'Pozastavit' : 'Přehrávat'}</span>
              </button>}
              <button type="button" className="pdpc-expand" onClick={() => setLightbox(index)} aria-label="Otevřít fotografii na celou obrazovku">
                <Maximize2 size={15} aria-hidden="true" /><span>Zvětšit</span>
              </button>
            </div>
          </div>

          {items.length > 1 && <>
            <div className="pdpc-thumbnail-track" role="group" aria-label={'Výběr fotografií produktu ' + product.name}>
              {items.map((thumbnail, thumbIndex) => (
                <button type="button" key={thumbnail.url} className="pdpc-thumbnail"
                  aria-label={'Zobrazit fotografii ' + (thumbIndex + 1) + ': ' + (thumbnail.title || product.name)}
                  aria-pressed={thumbIndex === index} onClick={() => { goTo(thumbIndex); setAutoPlay(false); }}>
                  <span className="pdpc-thumbnail-img"><img src={optimize(thumbnail.url)} alt="" loading="lazy" decoding="async" /></span>
                  <span className="pdpc-thumbnail-label">{thumbnail.badge || ('Pohled ' + (thumbIndex + 1))}</span>
                </button>
              ))}
            </div>
            <div className="pdpc-dots" role="group" aria-label="Rychlý výběr snímku">
              {items.map((thumbnail, thumbIndex) => (
                <button key={thumbnail.url} type="button" onClick={() => { goTo(thumbIndex); setAutoPlay(false); }}
                  aria-label={'Přejít na fotografii ' + (thumbIndex + 1)} aria-pressed={thumbIndex === index} />
              ))}
            </div>
          </>}
        </motion.div>
      </div>
      {lightbox !== null && items[lightbox] && <Fullscreen items={items} index={lightbox} productName={product.name}
        onClose={() => setLightbox(null)} onChange={(nextIndex) => setLightbox(clampIndex(nextIndex, items.length))} reduced={!!reduced} />}
    </section>
  );
}
