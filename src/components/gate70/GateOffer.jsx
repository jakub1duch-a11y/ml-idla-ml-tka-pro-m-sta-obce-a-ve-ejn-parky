import React from 'react';
import { SEGMENTS } from '@/components/gate70/gateConfig';

/**
 * Nabídka — cenové segmenty a kontaktní formulář.
 * Města/obce, parky/hřiště, architekti, pronájem na eventy.
 */
export default function GateOffer({ children }) {
  return (
    <section className="gate-section" id="gate-poptavka">
      <div className="gate-section-head">
        <span className="gate-kicker">06 / VÁŠ PROJEKT</span>
        <h2>Vaše místo.<br /><em>Vlastní GATE.</em></h2>
        <p>Cena se odvíjí od rozměrů, výbavy, instalace a řízení. Neuvádíme smyšlený ceník. Pošlete zadání a připravíme konkrétní nabídku.</p>
      </div>

      <div className="gate-offer-grid">
        {SEGMENTS.map((seg) => (
          <article key={seg.title}>
            <h3>{seg.title}</h3>
            <p>{seg.desc}</p>
            <b>{seg.price}</b>
            <a className="gate-brand-button" href="#gate-form">{seg.cta} →</a>
          </article>
        ))}
      </div>

      <div className="gate-contact-layout" id="gate-form">
        <div>
          <span className="gate-kicker">OD NÁVRHU K INSTALACI</span>
          <h3>Začněme<br />vaším prostorem.</h3>
          <p>Uveďte místo, přibližné rozměry, dostupnost vody a požadované řízení. Zkontrolujeme technickou proveditelnost a rozsah dodávky.</p>
          <a className="gate-inline-link" href="tel:+420774700390">+420 774 700 390</a><br />
          <a className="gate-inline-link" href="mailto:obchod1@holmtec.cz?subject=Technick%C3%BD%20list%20GATE70">Vyžádat technické podklady ↗</a>
        </div>
        {children}
      </div>
    </section>
  );
}