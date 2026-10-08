import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import '@/styles/catalog-video-hero.css';

const VIDEO = '/media/reference-videos/mrak-zahrada-hero.mp4';
const POSTER = '/media/catalog/misting-hero-poster.webp';

export default function KolekceHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [desired, setDesired] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || !document.hidden);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setDesired(!reduced.matches && !navigator.connection?.saveData);
    const onReduced = () => { if (reduced.matches) setDesired(false); };
    const onVisibility = () => setTabVisible(!document.hidden);
    reduced.addEventListener('change', onReduced);
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { observer.disconnect(); reduced.removeEventListener('change', onReduced); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (desired && visible && tabVisible && !failed) video.play().catch(() => setPlaying(false));
    else video.pause();
  }, [desired, visible, tabVisible, failed]);

  return <section ref={sectionRef} className="catalog-video-hero" aria-labelledby="catalog-hero-title">
    <div className="catalog-video-hero-media">
      <picture><source media="(max-width: 767px)" srcSet="/media/catalog/misting-hero-poster-mobile.webp" />
        <img src={POSTER} alt="Nerezový tvarový mlžicí prvek v zahradě s jemnou vodní mlhou" width="1280" height="720" fetchPriority="high" decoding="async" />
      </picture>
      {!failed && <video ref={videoRef} src={desired && visible ? VIDEO : undefined} poster={POSTER} muted loop playsInline preload="none"
        className={playing ? 'is-playing' : ''} aria-label="Ukázka mlžení v zahradním prostoru"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} />}
      <div className="catalog-video-hero-shade" />
      {!failed && <button type="button" className="catalog-video-toggle" aria-label={playing ? 'Pozastavit video' : 'Přehrát video mlžení'} onClick={() => { if (playing) setDesired(false); else if (desired) videoRef.current?.play().catch(() => setPlaying(false)); else setDesired(true); }}>
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}<span>{playing ? 'Pozastavit video' : 'Přehrát video'}</span>
      </button>}
    </div>
    <div className="catalog-video-hero-copy">
      <p className="catalog-video-hero-eyebrow">Katalog / MLŽIDLA®</p>
      <h1 id="catalog-hero-title">Vyberte mlžítko pro svůj prostor.</h1>
      <p className="catalog-video-hero-description">Sloupková mlžítka, průchozí brány, tvarové prvky i celé mlžné zóny. Prohlédněte si všechny produkty a vyberte řešení pro své místo.</p>
      <div className="catalog-video-hero-actions"><a href="#catalog">Přehled všech produktů <ArrowRight size={18} aria-hidden="true" /></a><Link to="/poptavka">Poradit s výběrem <ArrowRight size={18} aria-hidden="true" /></Link></div>
      <p className="catalog-video-hero-caption">Vodní mlha v pohybu · ukázka zahradní instalace</p>
    </div>
  </section>;
}
