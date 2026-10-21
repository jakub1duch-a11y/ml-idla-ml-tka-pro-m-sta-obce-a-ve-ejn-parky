import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG, STAGES, PHOTOS } from '@/components/gate70/gateConfig';
import createGateScene from '@/components/gate70/createGateScene';
import useGateScroll from '@/components/gate70/useGateScroll';

/**
 * Hlavní 3D sekce — sticky scéna s scroll-driven animací.
 * Čtyři fáze: povrch → mlžení → světlo → odpaření.
 */
export default function GateCore({ variant, onVariant }) {
  const section = useRef(null);
  const host = useRef(null);
  const state = useRef({ progress: 0, exploded: false, pointer: 0, manual: false });
  const [stage, setStage] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [error, setError] = useState(false);

  const onStage = useCallback((i) => setStage(i), []);
  useGateScroll(section, state, onStage);

  useEffect(() => {
    setError(false);
    try {
      return createGateScene(host.current, variant, state);
    } catch {
      setError(true);
    }
  }, [variant]);

  const toggle = () => {
    state.current.manual = true;
    state.current.exploded = !exploded;
    setExploded(!exploded);
  };

  return (
    <section
      ref={section}
      className="gate-scroll"
      id="gate-jadro"
      style={{ '--gate-scroll-distance': `${CONFIG.SCROLL_DISTANCE}px` }}
      aria-label="Čtyři fáze mlžné brány GATE70"
    >
      <div className="gate-sticky">
        {/* Horní lišta */}
        <div className="gate-core-top">
          <span className="gate-kicker">GATE70 / VYSOKOTLAKÁ MLŽNÁ BRÁNA</span>
          <a href="#gate-poptavka" className="gate-brand-button">Poptat řešení →</a>
        </div>

        {/* Hlavní layout — copy vlevo, 3D scéna vpravo */}
        <div className="gate-core-layout">
          <div className="gate-core-copy">
            <span className="gate-kicker">{STAGES[stage][0]} / 04 · FÁZE MLŽENÍ</span>
            <h1>
              {stage === 0 ? (
                <>Průchod.<br />Do jiného<br /><em>mikroklimatu.</em></>
              ) : STAGES[stage][1]}
            </h1>
            <p>{stage === 0 ? 'Architektonická mlžná brána. Čistá geometrie nerezu a jemná vodní mlha pro příjemnější městský prostor.' : STAGES[stage][2]}</p>

            <div className="gate-variant-buttons">
              {['U', 'V'].map((v) => (
                <button key={v} aria-pressed={variant === v} onClick={() => onVariant(v)}>
                  GATE70-{v}
                </button>
              ))}
            </div>

            <div className="gate-core-facts">
              <div>
                <strong>70 <small>bar</small></strong>
                <span>Vysokotlaké mlžení</span>
              </div>
              <div>
                <strong>5–10 <small>μm</small></strong>
                <span>Mikro-kapky</span>
              </div>
            </div>

            <a className="gate-inline-link" href="#gate-galerie">Prohlédnout městské vizualizace ↗</a>
          </div>

          {/* 3D scéna */}
          <div className="gate-scene-wrap">
            <div ref={host} className="gate-scene" data-testid="gate-scene" />
            {error && (
              <img className="gate-scene-poster" src={PHOTOS[variant === 'U' ? 0 : 1].url} alt="Referenční vizualizace brány GATE70" />
            )}
            <div className="gate-model-tag">
              Interaktivní 3D model podle fotografií<br />
              Tažením myši otáčejte, scrollováním ovládejte mlžení
            </div>
            <button className="gate-explode" aria-pressed={exploded} onClick={toggle}>
              {exploded ? 'Složit technologii' : 'Rozložit technologii'} <span>↗</span>
            </button>
          </div>
        </div>

        {exploded && (
          <div className="gate-equipment-note">
            Schéma volitelné sestavy: řídicí modul · ventil a šachta · stupně filtrace · nerezové rozvody.
            Rozsah určuje projekt, nejde o skutečný vnitřní řez bránou.
          </div>
        )}

        {/* Spodní lišta — track fází */}
        <div className="gate-stage-track">
          {STAGES.map(([n, title], i) => (
            <button
              key={n}
              aria-current={stage === i ? 'step' : undefined}
              onClick={() => {
                const el = section.current;
                const y = el.getBoundingClientRect().top + window.scrollY;
                state.current.scrollTo?.(y + (el.offsetHeight - window.innerHeight) * (i / 4 + 0.01));
              }}
            >
              <span>{n}</span>
              {title.split('.')[0]}
            </button>
          ))}
          <span className="gate-scroll-hint">Pokračujte posunutím ↓</span>
        </div>
      </div>
    </section>
  );
}