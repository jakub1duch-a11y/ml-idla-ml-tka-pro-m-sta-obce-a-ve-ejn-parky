import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Droplets, MoveDown } from 'lucide-react';
import './MistScrollStory.css';

// Reference-first: schválené produktové vizuály již používané na MLŽIDLA.cz.
// Vizualizace nejsou vydávány za fotografii dokončené realizace.
const MEDIA_BASE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';
const SCENES = [
  {
    id: 'gate',
    number: '01',
    category: 'TVAR PRO VEŘEJNÝ PROSTOR',
    title: 'Prostor dostává nový rytmus.',
    description: 'Mlžná brána STÉBLO GATE propojuje architektonickou linii s místem pro osvěžení. Vždy navrhujeme průchod, polohu trysek a kotvení podle konkrétního prostoru.',
    detail: 'STÉBLO GATE · produktový náhled',
    image: MEDIA_BASE + '9f27dc9cf_hero_steblo_gate_desktop_20261101.webp',
    alt: 'Produktový náhled mlžné brány STÉBLO GATE v parku',
    href: '/produkt/brana-bendy',
    link: 'Prohlédnout mlžnou bránu',
  },
  {
    id: 'linea',
    number: '02',
    category: 'DETAIL, KTERÝ JE VIDĚT',
    title: 'Nerezová linie. Lehkost vodní mlhy.',
    description: 'LINEA ukazuje, že mlžítko může být nenápadnou součástí pěší trasy, terasy i pobytové zóny. Jemná mlha vzniká v tryskách; skutečný účinek závisí na prostředí a navrženém provozu.',
    detail: 'LINEA a BENDY · fotografie',
    image: '/media/optimized/e7593e68f_realizace-IMG_5072.webp',
    alt: 'Fotografie nerezových mlžítek LINEA a BENDY u venkovního posezení',
    href: '/produkt/linea-mlzitko',
    link: 'Poznat kolekci LINEA',
  },
  {
    id: 'smart',
    number: '03',
    category: 'DESIGN A INTELIGENTNÍ PROVOZ',
    title: 'Každé místo má svůj scénář.',
    description: 'Od jednoho mlžítka po sestavu pro větší plochu. Volitelné řízení SUPLA může pracovat s časovým plánem a podle použité sestavy také s vhodnými snímači. Vše připravíme pro skutečné podmínky instalace.',
    detail: 'MRAK · produktová vizualizace',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    alt: 'Produktová vizualizace mlžítka MRAK ve školní zahradě',
    href: '/smart-ovladani',
    link: 'Jak funguje chytré řízení',
  },
];

function StoryImage({ scene, className = '' }) {
  return (
    <img
      className={className}
      src={scene.image}
      alt={scene.alt}
      loading="lazy"
      decoding="async"
      width="1200"
      height="900"
    />
  );
}

export default function MistScrollStory() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const nextIndex = Number(visible[0].target.dataset.storyIndex);
        if (Number.isInteger(nextIndex)) setActive(nextIndex);
      },
      { rootMargin: '-25% 0px -25% 0px', threshold: [0, 0.2, 0.45, 0.7] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const selectScene = (index) => {
    setActive(index);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    stepRefs.current[index]?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section className="mlz-story" ref={sectionRef} aria-labelledby="mlz-story-heading">
      <div className="mlz-story__aura" aria-hidden="true" />
      <div className="mlz-story__intro">
        <span className="mlz-story__eyebrow"><Droplets size={16} aria-hidden="true" /> MLŽIDLA × HOLMTEC</span>
        <h2 id="mlz-story-heading">Nejen mlžení. <em>Nový zážitek z prostoru.</em></h2>
        <p>Prohlédněte si, jak se design nerezových mlžítek propojuje s krajinou, architekturou a promyšleným provozem.</p>
        <span className="mlz-story__scroll-cue" aria-hidden="true"><MoveDown size={18} /> OBJEVTE TŘI POHLEDY</span>
      </div>
      <div className="mlz-story__body">
        <div className="mlz-story__stage">
          <div className="mlz-story__stage-shell">
            <div className="mlz-story__stage-grid" aria-hidden="true" />
            {SCENES.map((scene, index) => (
              <div
                className={'mlz-story__frame' + (active === index ? ' is-active' : '')}
                key={scene.id}
                aria-hidden="true"
              >
                <StoryImage scene={scene} className="mlz-story__image" />
                <div className="mlz-story__image-shade" />
                <span className="mlz-story__image-index">{scene.number} / 03</span>
                <span className="mlz-story__image-caption">{scene.detail}</span>
              </div>
            ))}
            <div className="mlz-story__stage-footer">
              <span>DESIGN · NEREZ · VODNÍ MLHA</span>
              <div className="mlz-story__stage-controls" aria-label="Přepnout scénu">
                {SCENES.map((scene, index) => (
                  <button
                    type="button"
                    key={scene.id}
                    className={'mlz-story__dot' + (active === index ? ' is-active' : '')}
                    aria-label={'Přejít na scénu ' + scene.number + ': ' + scene.category}
                    aria-pressed={active === index}
                    onClick={() => selectScene(index)}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mlz-story__chapters">
          {SCENES.map((scene, index) => (
            <article
              key={scene.id}
              ref={(node) => { stepRefs.current[index] = node; }}
              data-story-index={index}
              className={'mlz-story__chapter' + (active === index ? ' is-active' : '')}
            >
              <div className="mlz-story__chapter-inner">
                <span className="mlz-story__chapter-kicker"><i /> {scene.number} / {scene.category}</span>
                <div className="mlz-story__mobile-media">
                  <StoryImage scene={scene} />
                  <span>{scene.detail}</span>
                </div>
                <h3>{scene.title}</h3>
                <p>{scene.description}</p>
                <Link to={scene.href} className="mlz-story__link">
                  {scene.link} <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="mlz-story__outro">
        <span>PROSTOR MÁ SVŮJ CHARAKTER. MY MU DÁME SPRÁVNÝ TVAR.</span>
        <Link to="/poptavka">Navrhnout řešení pro můj prostor <ArrowRight size={19} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
