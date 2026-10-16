import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Pause, Play } from 'lucide-react';
import useMotionPlayback from './useMotionPlayback';
import MotionHeading from './MotionHeading';
import '@/styles/content-motion.css';

export default function ProductPhotoSequence({ product, zoom = false }) {
  const { ref, playing, reduced, paused, setPaused } = useMotionPlayback();
  const photos = useMemo(() => [...new Set([product?.image_url, ...(Array.isArray(product?.gallery_urls) ? product.gallery_urls : [])].filter(url => typeof url === 'string' && url.trim() && !/\.(webm|mp4|mov)([?#]|$)/i.test(url)))].slice(0, 4), [product?.image_url, product?.gallery_urls]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(new Set());
  const usable = photos.filter(url => !failed.has(url));
  const current = usable[index % Math.max(usable.length, 1)];
  useEffect(() => { setIndex(0); setFailed(new Set()); }, [product?.slug]);
  useEffect(() => {
    if (!playing || usable.length < 2) return undefined;
    const timer = setInterval(() => setIndex(value => (value + 1) % usable.length), 5500);
    return () => clearInterval(timer);
  }, [playing, usable.length]);
  if (!photos.length) return null;
  return <section ref={ref} className="product-photo-sequence" data-zoom={zoom} data-motion={playing ? 'playing' : 'paused'}><div className="product-photo-shell"><div><p className="space-eyebrow">Prohlédněte si zblízka</p><MotionHeading>{product.name}. Tvar, který patří do vašeho prostoru.</MotionHeading><p>Podívejte se na produkt z různých pohledů. Pro váš projekt společně upřesníme umístění, napojení vody a způsob ovládání.</p><Link className="space-quote-link" to={`/poptavka?produkt=${encodeURIComponent(product.name)}`}>Poptat {product.name} <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="product-photo-gallery"><figure><AnimatePresence initial={false}>{current && <motion.img key={current} src={current} alt={`${product.name} — náhled ${index % usable.length + 1}`} loading="lazy" decoding="async" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduced ? 0 : 0 }} transition={{ duration: reduced ? 0 : .65 }} onError={() => setFailed(value => new Set([...value, current]))} />}</AnimatePresence>{!current && <span className="product-photo-empty">Fotografie nyní není dostupná.</span>}</figure><div className="product-photo-controls" role="group" aria-label={`Fotografie produktu ${product.name}`}>{usable.map((url, view) => <button type="button" key={url} onClick={() => { setIndex(view); setPaused(true); }} aria-pressed={view === index % usable.length} aria-label={`Zobrazit náhled ${view + 1} produktu ${product.name}`}>{view + 1}</button>)}{!reduced && usable.length > 1 && <button type="button" className="product-photo-play" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Přehrát fotografie produktu' : 'Zastavit fotografie produktu'}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>}</div></div></div></section>;
}
