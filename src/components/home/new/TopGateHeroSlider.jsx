import React from 'react';
import { Link } from 'react-router-dom';

// První prezentační hero nad původním carousel HomeHero.
// Zdrojové obrazy obsahují hotový text i CTA: nikdy je nepřekrývat druhou sadou textů.
// Na mobilu použít samostatnou vertikální kompozici s CELOU mlžnou branou.
const DESKTOP_HERO = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/403df930a_steblo_gate_hero_desktop_20261031.webp';
const MOBILE_HERO = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3cdcb3f46_steblo_gate_hero_mobile_20261031.webp';

export default function TopGateHeroSlider() {
  return (
    <section
      className="relative isolate w-full bg-[#07131d] pt-[var(--site-header-height,80px)]"
      aria-label="STÉBLO GATE® – designová mlžná brána"
    >
      <Link
        to="/produkt/brana-bendy"
        aria-label="STÉBLO GATE® – prohlédnout produkt mlžná brána"
        className="relative mx-auto block w-full max-w-[1920px] overflow-hidden bg-[#07131d] focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
      >
        <picture>
          <source media="(max-width: 639px)" srcSet={MOBILE_HERO} type="image/webp" />
          <img
            src={DESKTOP_HERO}
            alt="STÉBLO GATE® – kompletní mlžná brána ze dvou zakřivených nerezových prvků, jemné mlžení na náměstí"
            width="1672"
            height="941"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="block h-auto w-full object-contain"
          />
        </picture>
      </Link>
    </section>
  );
}
