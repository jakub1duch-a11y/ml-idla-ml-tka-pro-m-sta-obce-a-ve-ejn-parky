import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Snowflake, Droplets, Leaf } from 'lucide-react';
import './TopGateHeroSlider.css';

// Jediná editovatelná šablona pro všechny produktové hero slidy.
// Foto obsahuje pouze produkt a prostředí, nadpisy a tlačítka jsou živé HTML.
const MEDIA = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';
export const PRODUCT_HERO_SLIDES = [
  {
    id: 'gate',
    category: 'MLŽNÁ BRÁNA',
    title: 'STÉBLO GATE®',
    description: 'Designová mlžná brána pro příjemné ochlazení veřejného prostoru.',
    benefits: ['Ochlazuje okolí', 'Osvěžuje lidi', 'Zvyšuje komfort'],
    image: MEDIA + '97309aaf2_steblo_gate_clean_live_overlay.webp',
    mobileImage: MEDIA + 'b6b10dbad_gate_mobile.webp',
    link: '/produkt/brana-bendy',
  },
  {
    id: 'mrak',
    category: 'MLŽNÝ MRAK',
    title: '1414',
    description: 'Designové mlžítko pro osvěžení a radost ve veřejném prostoru.',
    benefits: ['Ochlazuje okolí', 'Osvěžuje lidi', 'Zkrášluje prostor'],
    image: MEDIA + 'e88fa9954_mrak_desktop.webp',
    mobileImage: MEDIA + '8340e3fb4_mrak_mobile.webp',
    link: '/produkt/mlzny-mrak-1414',
  },
  {
    id: 'kruh',
    category: 'MLŽNÁ BRÁNA',
    title: 'MLŽÍTKO KRUH',
    description: 'Designové mlžítko pro příjemné osvěžení veřejného prostoru.',
    benefits: ['Ochlazuje okolí', 'Osvěžuje lidi', 'Zvýrazňuje prostor'],
    image: MEDIA + 'c657064ba_kruh_desktop.webp',
    mobileImage: MEDIA + 'ef61f1ba6_kruh_mobile.webp',
    link: '/produkt/mlzitko-kruh',
  },
];
const ICONS = [Snowflake, Droplets, Leaf];

export default function TopGateHeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const start = useRef(null);
  const [manualSelection, setManualSelection] = useState(false);
  const select = useCallback((i) => { setManualSelection(true); setIndex((i + PRODUCT_HERO_SLIDES.length) % PRODUCT_HERO_SLIDES.length); }, []);
  useEffect(() => {
    if (paused || manualSelection || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % PRODUCT_HERO_SLIDES.length), 9000);
    return () => window.clearInterval(timer);
  }, [paused, manualSelection]);
  const slide = PRODUCT_HERO_SLIDES[index];
  return (
    <section className="mlz-product-hero" aria-label="Produktová prezentace MLŽIDLA.cz" aria-roledescription="karusel"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onTouchStart={(e) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        if (!start.current) return;
        const dx = e.changedTouches[0].clientX - start.current.x;
        const dy = e.changedTouches[0].clientY - start.current.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) select(index + (dx < 0 ? 1 : -1));
        start.current = null;
      }}
    >
      <div className={`mlz-product-hero__frame mlz-product-hero__frame--${slide.id}`} key={slide.id}>
        <div className="mlz-product-hero__media" aria-hidden="true">
          <picture>
            <source media="(max-width: 639px)" srcSet={slide.mobileImage} type="image/webp" />
            <img src={slide.image} alt="" loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
          </picture>
        </div>
        <div className="mlz-product-hero__copy">
          <div className="mlz-product-hero__brand" aria-label="MLŽIDLA.CZ"><span className="mlz-product-hero__brand-mark" aria-hidden="true"><i /></span><span>MLŽIDLA.CZ</span></div>
          <p className="mlz-product-hero__eyebrow">{slide.category}</p>
          <h2 className="mlz-product-hero__title">{slide.title}</h2>
          <span className="mlz-product-hero__rule" aria-hidden="true" />
          <p className="mlz-product-hero__description">{slide.description}</p>
          <div className="mlz-product-hero__benefits" aria-label="Hlavní výhody">
            {slide.benefits.map((benefit, i) => {
              const Icon = ICONS[i];
              return <div key={benefit} className="mlz-product-hero__benefit">
                <span className="mlz-product-hero__icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>
                <span>{benefit}</span>
              </div>;
            })}
          </div>
          <Link to={slide.link} className="mlz-product-hero__cta">Prohlédnout produkt <ArrowRight size={20} aria-hidden="true" /></Link>
        </div>
      </div>
      <nav className="mlz-product-hero__nav" aria-label="Prohlédnout mlžítka">
        <span className="mlz-product-hero__nav-label">Prohlédněte si mlžítka</span>
        <div className="mlz-product-hero__products" role="group" aria-label="Vybrat produkt k zobrazení">
          {PRODUCT_HERO_SLIDES.map((item, i) =>
            <button type="button" key={item.id}
              aria-label={`Zobrazit produkt ${item.title}`}
              aria-pressed={i === index}
              onClick={() => select(i)}
              className={`mlz-product-hero__product ${i === index ? 'is-active' : ''}`}>
              <span className="mlz-product-hero__product-thumb" aria-hidden="true"><img src={item.image} alt="" loading="lazy" /></span>
              <span className="mlz-product-hero__product-text"><span className="mlz-product-hero__product-number">{String(i + 1).padStart(2, '0')}</span><span className="mlz-product-hero__product-name">{item.title === '1414' ? 'MRAK 1414' : item.title}</span></span>
            </button>
          )}
        </div>
        <span className="mlz-product-hero__counter" aria-label={`Produkt ${index + 1} ze ${PRODUCT_HERO_SLIDES.length}`}>{String(index + 1).padStart(2, '0')} / {String(PRODUCT_HERO_SLIDES.length).padStart(2, '0')}</span>
      </nav>
    </section>
  );
}
