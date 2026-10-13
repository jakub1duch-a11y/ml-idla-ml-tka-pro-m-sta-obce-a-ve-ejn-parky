import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
import OfferSuplaVariant from '@/components/offers/OfferSuplaVariant';
import { SUPLA_VISUALS } from '@/components/offers/suplaVisuals';
import { Smartphone, Clock, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import './suplaOffer.css';
export default function OfferSuplaSheet({ c }) {
  return <div className="op-supla-package">
    <OfferFlowPage title="Chytré řízení mlžení SUPLA" subtitle="Volitelné rozšíření / Wi-Fi + mobilní aplikace">
      <p className="op-txt">Od manuálního spouštění k pohodlnému provozu. Vyberte jednu ze dvou alternativ, automatizace není součástí základní ceny mlžítka.</p>
      <p className="supla-scope-note op-txt"><b>Bez servisní šachty 29 639 Kč · se servisní šachtou 48 539 Kč. Ceny bez DPH.</b></p>
      <img className="supla-offer-image" src={SUPLA_VISUALS.valve} alt="Koncepční vizualizace chytrého ventilu, Wi-Fi řízení SUPLA a mobilní aplikace" />
      <p className="op-cap">Ilustrační sestava, nikoli přesný seznam dodávaného hardware nebo montážní dokumentace.</p>
    </OfferFlowPage>
    <OfferFlowPage title="Jedna vrstva pro běžný provoz," subtitle="automatizaci i servis.">
      <img className="supla-modules-image" src={SUPLA_VISUALS.modules} alt="Ilustrační SUPLA moduly, chráněná elektronika a chytrý ventil" />
      <div className="supla-benefit-list">{[[Smartphone, 'Ovládání v aplikaci', 'Zapnutí a vypnutí při dostupném internetu.'], [Clock, 'Časové scénáře', 'Provozní okna podle využití prostoru.'], [ShieldCheck, 'Snadnější servis', 'Box pro kontrolu a sezónní údržbu.'], [SlidersHorizontal, 'Rozšíření podle projektu', 'Čidla pouze podle potvrzené výbavy.']].map(([Icon, title, text]) => <div key={title}><Icon className="supla-feature-icon" /><strong>{title}</strong><p className="op-txt">{text}</p></div>)}</div>
      <p className="op-cap">AI vizualizace komponent jsou koncepční, nikoli katalog konkrétních dodávaných modelů.</p>
      <p className="supla-scope-note op-txt">Před instalací ověříme přívod vody, Wi-Fi, internet, bezpečné napájení, umístění elektroniky a zazimování.</p>
    </OfferFlowPage>
    <OfferSuplaVariant c={c} shaft={false} /><OfferSuplaVariant c={c} shaft />
  </div>;
}