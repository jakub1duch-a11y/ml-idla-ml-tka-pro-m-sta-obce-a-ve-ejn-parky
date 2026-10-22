import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Reálné záběry z Mlžného disku (optimalizované kopie), vybrané pro hero.
const SLIDES = [
  { src: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e4438d3b0_bendy_linea_vert.mp4', label: 'BENDY + LINEA', title: 'Mlžný sloup v zahradě', link: '/produkt/mlzitko-bendy' },
  { src: '/media/optimized/eb7e87313_mlzidla-mlzitkaproparkyamesta03.webm', label: 'Městská instalace', title: 'Mlžítka v parku a na náměstí', link: '/mestske-mlzitka' },
  { src: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/78cf9a6c8_KolekceBendy_20260812_121335_0000.mp4', label: 'Realizace BENDY', title: 'Organická linie v pobytové zóně', link: '/produkt/mlzitko-bendy' },
  { src: '/media/optimized/0d9a4e147_mlznabranaGATE70-video.webm', label: 'Mlžná brána GATE', title: 'Průchozí vodní mlha', link: '/mlzne-brany' },
  { src: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/c37b035c2_mlzidla-linea-real-video-01.mp4', label: 'LINEA v provozu', title: 'Nerezová linie s jemnou mlhou', link: '/linea' },
];

export default function HeroVideoSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setActive((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearTimeout(t);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <div className="hero-video-slider" aria-roledescription="carousel" aria-label="Videa z realizací">
      {SLIDES.map((s, i) => (
        <video
          key={s.src}
          className={i === active ? 'is-active' : ''}
          src={s.src}
          autoPlay
          muted
          loop
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          aria-hidden={i !== active}
        />
      ))}
      <div className="hvs-shade" />
      <div className="hvs-caption">
        <span>{slide.label}</span>
        <Link to={slide.link}>{slide.title} →</Link>
      </div>
      <div className="hvs-dots">
        {SLIDES.map((s, i) => (
          <button key={s.src} type="button" aria-label={s.label} aria-pressed={i === active} onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  );
}