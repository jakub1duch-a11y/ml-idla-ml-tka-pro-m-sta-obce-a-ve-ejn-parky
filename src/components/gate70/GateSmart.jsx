import React, { useState } from 'react';
import { SMART_MODES } from '@/components/gate70/gateConfig';

/**
 * Smart řízení & kompatibilita — ekosystém inteligentního provozu.
 * Přepínač módů: teplotní automatika, časový plán, pohybový senzor, Smart City API, měření spotřeby.
 */
export default function GateSmart() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="gate-section gate-smart" id="gate-smart">
      <div className="gate-section-head">
        <span className="gate-kicker">05 / VOLITELNÝ EKOSYSTÉM</span>
        <h2>Inteligence v provozu.<br /><em>Klid v prostoru.</em></h2>
        <p>Přívod vody, filtrace, chytrý ventil a nerezová brána. Řízení, senzory, napájení a případná technologická šachta se vybírají podle projektu.</p>
      </div>

      <div className="gate-smart-layout">
        <div className="gate-smart-tabs" role="tablist" aria-label="Způsob smart řízení">
          {SMART_MODES.map(([title], i) => (
            <button
              key={title}
              role="tab"
              id={`gate-tab-${i}`}
              aria-controls="gate-smart-panel"
              aria-selected={i === selected}
              onClick={() => setSelected(i)}
            >
              {String(i + 1).padStart(2, '0')} <span>{title}</span> ↗
            </button>
          ))}
        </div>

        <div className="gate-smart-panel" id="gate-smart-panel" role="tabpanel" aria-labelledby={`gate-tab-${selected}`}>
          <span className="gate-status">VOLITELNÁ KONFIGURACE</span>
          <h3>{SMART_MODES[selected][0]}</h3>
          <p>{SMART_MODES[selected][1]}</p>
          <div className="gate-flow">
            {SMART_MODES[selected][2].split(' → ').map((s, i) => (
              <div className="gate-flow-step" key={s}>
                {i > 0 && <span aria-hidden="true">↓</span>}
                <b>{s}</b>
              </div>
            ))}
          </div>
          <small>Koncepční schéma. Není připojeno ke skutečnému zařízení.</small>
        </div>
      </div>

      <a className="gate-inline-link" href="/smart-ovladani">Podrobnosti chytrého řízení ↗</a>
    </section>
  );
}