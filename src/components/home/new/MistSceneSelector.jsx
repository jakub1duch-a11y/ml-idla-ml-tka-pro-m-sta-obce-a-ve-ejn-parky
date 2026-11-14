import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import './MistSceneSelector.css';

// Existing, approved product/hero images already used by the public homepage.
const SCENES = [
  {
    id: 'city', number: '01', label: 'Města a obce', title: 'Mlha mění městský prostor.',
    description: 'Nerezová mlžítka a průchozí mlžné brány pro náměstí, promenády a parky.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9f27dc9cf_hero_steblo_gate_desktop_20261101.webp',
    alt: 'Vizualizace mlžné brány STÉBLO GATE v městském prostoru', path: '/mestske-mlzitka'
  },
  {
    id: 'garden', number: '02', label: 'Zahrady a terasy', title: 'Osvěžení pro chvíle venku.',
    description: 'Designová zahradní mlžítka, která doplňují posezení, zeleň a architekturu.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e88fa9954_mrak_desktop.webp',
    alt: 'Vizualizace nerezového mlžítka MRAK', path: '/rezidencni-mlzeni'
  },
  {
    id: 'custom', number: '03', label: 'Zakázkové tvary', title: 'Vlastní tvar. Vlastní prostor.',
    description: 'Mlžné sochy a prvky navržené podle fotografie, skici nebo projektu.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bb98ea004_kruh_gate_hero_desktop.webp',
    alt: 'Vizualizace nerezového mlžítka s kruhovou geometrií', path: '/zakazkova-mlzitka'
  }
];

export default function MistSceneSelector() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const scene = SCENES[active];

  return (
    <section className="ml-mist-scenes" aria-labelledby="ml-mist-scenes-title">
      <div className="ml-mist-scenes-shell">
        <div className="ml-mist-scenes-intro">
          <p className="ml-mist-scenes-eyebrow">MLŽIDLA V PROSTORU · INTERAKTIVNÍ VÝBĚR</p>
          <h2 id="ml-mist-scenes-title">Jak může vypadat <em>vaše mlžítko?</em></h2>
          <p>Vyberte prostředí. Fotografie a vizualizace ukážou, jak se nerezová konstrukce a jemná mlha mohou stát součástí prostoru.</p>
        </div>
        <div className="ml-mist-scenes-stage">
          <div className="ml-mist-scenes-image" aria-live="off">
            <AnimatePresence mode="wait">
              <motion.img key={scene.id} src={scene.image} alt={scene.alt} loading="lazy" decoding="async"
                initial={reduced ? false : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }} />
            </AnimatePresence>
            <div className="ml-mist-scenes-vignette" aria-hidden="true" />
            <span className="ml-mist-scenes-caption">Ilustrační vizualizace · provedení dle konkrétního produktu</span>
          </div>
          <div className="ml-mist-scenes-panel">
            <div className="ml-mist-scenes-options" role="group" aria-label="Vybrat prostředí mlžítka">
              {SCENES.map((item, index) => (
                <button type="button" key={item.id} onClick={() => setActive(index)}
                  aria-pressed={active === index} className={active === index ? 'is-active' : ''}>
                  <span>{item.number}</span>{item.label}<ArrowUpRight size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="ml-mist-scenes-copy" aria-live="polite" aria-atomic="true">
              <p className="ml-mist-scenes-eyebrow">{scene.label}</p>
              <h3>{scene.title}</h3>
              <p>{scene.description}</p>
              <Link to={scene.path} className="ml-mist-scenes-link">Prozkoumat řešení <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}