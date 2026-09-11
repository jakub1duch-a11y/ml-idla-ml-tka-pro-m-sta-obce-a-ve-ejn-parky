import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const ZOO_ID = '6a42491409abbf575447aaeb';

const CATEGORY_ICONS = {
  Mesta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M8 20v-5h3v5M14 20v-5h3v5M2 20h20" />
    </svg>
  ),
  Parky: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V7M12 11 7 7M12 14l5-5M12 7l3-4M5 21h14M7 21v-4h10v4" />
    </svg>
  ),
  Promenady: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2 20c.7-3 2.7-5 6-5s5.3 2 6 5M10 20c.6-2.6 2.6-4 6-4 2.8 0 4.8 1.3 6 4" />
    </svg>
  ),
  Sportoviste: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 2.4 5.2L20 9l-4 4 .9 5.7-4.9-2.7-4.9 2.7L8 13l-4-4 5.6-.8z" />
    </svg>
  ),
};

const CATEGORIES = [
  { label: 'Města', Icon: CATEGORY_ICONS.Mesta },
  { label: 'Parky', Icon: CATEGORY_ICONS.Parky },
  { label: 'Promenády', Icon: CATEGORY_ICONS.Promenady },
  { label: 'Sportoviště', Icon: CATEGORY_ICONS.Sportoviste },
];

export default function HomeHero() {
  const [bgImage, setBgImage] = useState(VIDEO_ASSETS.heroJicin.poster);

  useEffect(() => {
    let mounted = true;
    base44.entities.Realizace.get(ZOO_ID)
      .then((ref) => { if (mounted && ref?.image_url) setBgImage(ref.image_url); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section className="hbp">
      <div className="hbp-content">
        <div className="hbp-brand">
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M18 82C18 45 45 18 74 18" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
            <path d="M18 72C18 35 45 8 74 8" stroke="currentColor" strokeWidth="9" strokeLinecap="round" opacity=".45" />
            <path d="M18 92C18 55 45 28 74 28" stroke="currentColor" strokeWidth="9" strokeLinecap="round" opacity=".22" />
            <circle cx="76" cy="20" r="9" fill="currentColor" />
          </svg>
          <span>MLŽIDLA.CZ</span>
        </div>

        <h1 className="hbp-headline">
          Ochlazujeme <span>vzduch</span><br />kolem vás
        </h1>

        <p className="hbp-subhead">
          Města <b>•</b> parky <b>•</b> promenády <b>•</b> sportoviště
        </p>

        <div className="hbp-actions">
          <Link to="/poptavka" className="hbp-primary">
            POPTAT ŘEŠENÍ
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h13" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
          <Link to="/mlzidla-mlzitka" className="hbp-secondary">
            Prohlédnout produkty
          </Link>
        </div>

        <div className="hbp-baseband">
          {CATEGORIES.map(({ label, Icon }) => (
            <div key={label} className="hbp-category">
              {Icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hbp-visual hbp-animate" aria-hidden="true">
        <img src={bgImage} alt="Mlžítka pro veřejný prostor — reálná instalace" />
        <div className="hbp-ring" />
        <div className="hbp-arch" />
        <div className="hbp-nozzles">
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className="hbp-guide hbp-guide-top">Ø 3200</div>
        <div className="hbp-guide hbp-guide-bottom">STAINLESS STEEL</div>
        <div className="hbp-guide hbp-guide-left">MISTING ARCH</div>
        <div className="hbp-marker hbp-m1" />
        <div className="hbp-marker hbp-m2" />
        <div className="hbp-marker hbp-m3" />
      </div>
    </section>
  );
}