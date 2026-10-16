import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import ProductPhotoSequence from './ProductPhotoSequence';
import MotionHeading from './MotionHeading';
import useMotionPlayback from './useMotionPlayback';
import '@/styles/product-live-motion.css';

export default function ProductMotionShowcase({ product }) {
  const { ref, playing, reduced, paused, setPaused } = useMotionPlayback();
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const exactProduct = product.slug === 'aura-mlzitko';
  const clip = exactProduct ? 'aura-live' : 'mist-live';
  useEffect(() => { setFailed(false); setLoaded(false); }, [clip]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, loaded]);
  return <>
    <ProductPhotoSequence product={product} zoom />
    <section ref={ref} className="product-live-section" data-motion={playing ? 'playing' : 'paused'}>
      <div className="product-live-shell">
        <div className="product-live-visual">
          {playing && !failed && <video ref={videoRef} key={clip} poster={`/media/motion/${clip}-poster.webp`} muted loop playsInline preload="none" onLoadedData={() => setLoaded(true)} onError={() => setFailed(true)} aria-label={exactProduct ? 'AURA — detail mlžení v provozu' : 'Ukázka jemné mlhy v reálné instalaci'}><source src={`/media/motion/${clip}.webm`} type="video/webm" /><source src={`/media/motion/${clip}.mp4`} type="video/mp4" /></video>}
          <img className={playing && loaded && !failed ? 'live-poster live-poster-hidden' : 'live-poster'} src={failed && playing ? `/media/motion/${clip}.gif` : `/media/motion/${clip}-poster.webp`} alt={exactProduct ? 'Trysky mlžítka AURA při mlžení' : 'Jemná mlha u nerezového mlžítka v parku — ukázka technologie'} loading="lazy" decoding="async" />
          <span className="product-live-mist" aria-hidden="true" />
          <span className="product-live-caption">{exactProduct ? 'AURA · detail v provozu' : 'Detail mlžení · ukázka technologie'}</span>
          {!reduced && <button type="button" className="product-live-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)} aria-label={paused ? 'Přehrát živý náhled' : 'Zastavit živý náhled'}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{paused ? 'Přehrát' : 'Zastavit'}</button>}
        </div>
        <div className="product-live-copy"><p className="space-eyebrow">Pohyb, který osvěží prostor</p><MotionHeading>{exactProduct ? 'AURA zblízka. Jemná mlha v pohybu.' : 'Lehká mlha. Příjemnější místo pro pobyt.'}</MotionHeading><p>Krátký záběr ukazuje charakter mlhy a pohyb drobných kapek. Pro {product.name} navrhneme rozmístění, napojení vody a ovládání podle vašeho prostoru.</p><ul><li>Umístění s ohledem na pohyb lidí</li><li>Čisté napojení a vhodné kotvení</li><li>Možnosti řízení podle konkrétní instalace</li></ul><Link className="space-quote-link" to={`/poptavka?produkt=${encodeURIComponent(product.name)}`}>Navrhnout řešení pro můj prostor <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </section>
  </>;
}
