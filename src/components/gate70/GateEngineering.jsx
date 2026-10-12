import React, { useState } from 'react';
import { SPECS } from '@/components/gate70/gateConfig';

/**
 * Inženýrské parametry — datově bohaté panely pro architekty a zástupce měst.
 * Zobrazuje: tlak, spotřebu vody, velikost kapky, dosah ochlazovací zóny.
 * Interaktivní kalkulačka provozního režimu a úspory vody.
 */
export default function GateEngineering({ product, loading, error }) {
  const [hours, setHours] = useState(8);
  const [duty, setDuty] = useState(50);

  // Modelový výpočet: 12 trysek × 0.12 l/h × hodiny × duty %
  const nozzles = 12;
  const perNozzle = 0.12;
  const daily = nozzles * perNozzle * hours * duty / 100;
  const continuous = nozzles * perNozzle * hours;
  const savings = continuous > 0 ? Math.round((1 - daily / continuous) * 100) : 0;

  const facts = [
    ['01 / TLAK', product?.pressure || '70 bar', 'Vysokotlaké mlžení pro mikro-kapky 5–10 μm. Jemná mlha, která se okamžitě odpařuje.'],
    ['02 / SPOTŘEBA', product?.water_consumption || '0.12 l/h', 'Spotřeba vody na jednu trysku při 70 bar. Úspora až 70 % oproti postřikovačům.'],
    ['03 / KAPKA', product?.micron_size || '5–10 μm', 'Mikro-kapky vodního aerosolu. Suché mlžení — bez zvlhčování povrchů.'],
    ['04 / DOSAH', '3–5 m', 'Chladicí dosah ochlazovací zóny od brány. Záleží na proudění vzduchu.'],
  ];

  return (
    <section className="gate-section" id="gate-parametry">
      <div className="gate-section-head">
        <span className="gate-kicker">03 / INŽENÝRSKÉ PODKLADY</span>
        <h2>Jasná data.<br /><em>Žádné prázdné sliby.</em></h2>
        <p>
          {loading ? 'Načítám aktuální katalogové údaje…' :
           error ? 'Katalog se nepodařilo načíst. Zobrazené základní údaje vycházejí z posledního dostupného produktového podkladu.' :
           'Aktuální katalogové údaje. Přesné rozměry, průtok trysek, kotvení a dosah potvrdíme pro konkrétní instalaci.'}
        </p>
      </div>

      {/* Metriky — 4 datové panely */}
      <div className="gate-metrics">
        {facts.map(([code, value, note]) => (
          <article key={code}>
            <span className="gate-kicker">{code}</span>
            <h3>{value}</h3>
            <p>{note}</p>
          </article>
        ))}
      </div>

      {/* Kalkulačka provozního režimu */}
      <div className="gate-budget">
        <div>
          <span className="gate-kicker">MODEL PROVOZU / NE MĚŘENÍ</span>
          <h3>Voda jen tehdy,<br />když ji prostor potřebuje.</h3>
          <p>
            Příklad s {nozzles} tryskami a průtokem {perNozzle} l/h na trysku.
            Časové řízení omezuje dobu otevření ventilu — uvedená úspora není garantovaným parametrem výrobku.
          </p>
        </div>
        <div className="gate-budget-inputs">
          <label htmlFor="gate-hours">Provozní okno <b>{hours} h / den</b></label>
          <input id="gate-hours" type="range" min="1" max="24" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
          <label htmlFor="gate-duty">Podíl aktivního mlžení <b>{duty} %</b></label>
          <input id="gate-duty" type="range" min="10" max="100" step="10" value={duty} onChange={(e) => setDuty(Number(e.target.value))} />
          <output data-testid="gate-water-estimate">{daily.toFixed(2)} l / den</output>
          <p>Modelová úspora proti nepřetržitému mlžení ve stejném okně: <strong>{savings} %</strong></p>
        </div>
      </div>

      <div className="gate-spec-strip">
        <span>{product?.material || 'Nerezová konstrukce'}</span>
        <span>U / V · dvě geometrie</span>
        <span>Zakázkové rozměry a kotvení</span>
        <span>70 bar · vysokotlaké mlžení</span>
      </div>
    </section>
  );
}