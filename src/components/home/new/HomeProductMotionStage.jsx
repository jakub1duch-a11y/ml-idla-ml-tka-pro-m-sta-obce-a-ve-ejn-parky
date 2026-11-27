import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import './HomeProductMotionStage.css';

// Prezentační vizuály převzaté z existujících produktových hero slidů.
// Nejsou zde žádné synteticky změněné proporce výrobků.
const MEDIA = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';
const scenes = [
  {
    id: 'steblo',
    number: '01',
    category: 'MLŽNÉ BRÁNY',
    title: 'STÉBLO GATE',
    headline: 'Průchod, který osvěží.',
    description: 'Vzdušná nerezová brána pro městský prostor, parky a veřejná setkávání.',
    image: MEDIA + '9f27dc9cf_hero_steblo_gate_desktop_20261101.webp',
    mobileImage: MEDIA + '4b88f291b_hero_steblo_gate_mobile_20261101.webp',
    href: '/produkt/brana-bendy',
  },
  {
    id: 'mrak',
    number: '02',
    category: 'MLŽNÉ SOCHY',
    title: 'MRAK 1414',
    headline: 'Socha, kterou zažijete.',
    description: 'Výrazný prvek, ve kterém se design potkává s jemnou vodní mlhou.',
    image: MEDIA + 'e88fa9954_mrak_desktop.webp',
    mobileImage: MEDIA + '8340e3fb4_mrak_mobile.webp',
    href: '/produkt/mlzny-mrak-1414',
  },
  {
    id: 'kruh',
    number: '03',
    category: 'ARCHITEKTONICKÁ MLŽÍTKA',
    title: 'KRUH',
    headline: 'Geometrie s funkcí.',
    description: 'Čistá linie a osvěžující atmosféra pro místa, kde se lidé zastavují.',
    image: MEDIA + 'bb98ea004_kruh_gate_hero_desktop.webp',
    mobileImage: MEDIA + 'e81ee6d1d_kruh_gate_hero_mobile.webp',
    href: '/produkt/mlzitko-kruh',
  },
];

export default function HomeProductMotionStage() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);
  const reduceMotion = useReducedMotion();
  const current = scenes[active];

  const select = (index) => setActive((index + scenes.length) % scenes.length);

  return (
    <section className="ml-motion-story" aria-labelledby="ml-motion-story-title">
      <div className="ml-motion-story__shell">
        <div className="ml-motion-story__intro">
          <div>
            <p className="ml-motion-story__eyebrow"><span aria-hidden="true" className="ml-motion-story__dot" /> PRODUKTY V PROSTORU</p>
            <h2 id="ml-motion-story-title">Ochlazení, které <em>upoutá.</em></h2>
          </div>
          <p>Objevte, jak se z nerezového prvku stává zážitek. Vyberte produkt a prohlédněte si jeho podobu v prostoru.</p>
        </div>

        <div className="ml-motion-story__stage"
          onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={(event) => {
            if (!touchStart.current) return;
            const dx = event.changedTouches[0].clientX - touchStart.current.x;
            const dy = event.changedTouches[0].clientY - touchStart.current.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.35) select(active + (dx < 0 ? 1 : -1));
            touchStart.current = null;
          }}>
          <div className="ml-motion-story__visual">
            <AnimatePresence initial={false} mode="wait">
              <motion.div key={current.id} className="ml-motion-story__scene"
                initial={reduceMotion ? false : { opacity: 0, x: 30, scale: 1.02 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -24, scale: 0.99 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}>
                <picture className="ml-motion-story__picture">
                  <source media="(max-width: 639px)" srcSet={current.mobileImage} />
                  <img src={current.image} alt={current.title + ' – ilustrační produktová vizualizace Mlžidla.cz'} loading="lazy" decoding="async" />
                </picture>
                <div className="ml-motion-story__shade" aria-hidden="true" />
                <div className="ml-motion-story__scene-copy">
                  <span className="ml-motion-story__scene-category">{current.category} <span aria-hidden="true">/</span> {current.number}</span>
                  <h3>{current.headline}</h3>
                  <p>{current.description}</p>
                  <Link to={current.href} className="ml-motion-story__link">Prohlédnout {current.title} <ArrowUpRight size={18} aria-hidden="true" /></Link>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="ml-motion-story__arrows" aria-label="Procházení produktů">
              <button type="button" onClick={() => select(active - 1)} aria-label="Předchozí produkt"><ArrowLeft aria-hidden="true" size={21} /></button>
              <button type="button" onClick={() => select(active + 1)} aria-label="Další produkt"><ArrowRight aria-hidden="true" size={21} /></button>
            </div>
          </div>
          <div className="ml-motion-story__selector" role="group" aria-label="Zvolte produkt">
            {scenes.map((scene, index) => (
              <button key={scene.id} type="button" className={'ml-motion-story__tab' + (active === index ? ' is-active' : '')}
                onClick={() => select(index)} aria-pressed={active === index}>
                <span className="ml-motion-story__tab-number">{scene.number}</span>
                <span className="ml-motion-story__tab-name">{scene.title}</span>
                <span className="ml-motion-story__tab-line" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">Vybraný produkt: {current.title}, {active + 1} ze {scenes.length}</p>
        <p className="ml-motion-story__caption">Ilustrační produktové vizualizace. Konkrétní provedení a technické řešení dle zvoleného výrobku.</p>
      </div>
    </section>
  );
}
