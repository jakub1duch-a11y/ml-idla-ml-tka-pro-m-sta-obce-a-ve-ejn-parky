import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
import OfferSuplaVariant from '@/components/offers/OfferSuplaVariant';
import './suplaOffer.css';
export default function OfferSuplaSheet({ c }) {
  return <div className="op-supla-package">
    <OfferFlowPage title="Chytré řízení mlžení SUPLA" subtitle="Volitelné rozšíření / Wi-Fi + mobilní aplikace">
      <p className="op-txt">Od manuálního spouštění k pohodlnému provozu. Vyberte jednu ze dvou alternativ, automatizace není součástí základní ceny mlžítka.</p>
      <p className="supla-scope-note op-txt"><b>Bez servisní šachty 29 639 Kč · se servisní šachtou 48 539 Kč. Ceny bez DPH.</b></p>
      <img className="supla-offer-image" src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/34a09ac6b_generated_image.png" alt="Koncepční ilustrace telefonu, řízení, ventilu a servisního boxu" />
      <p className="op-cap">Ilustrační sestava, nikoli přesný seznam dodávaného hardware nebo montážní dokumentace.</p>
    </OfferFlowPage>
    <OfferFlowPage title="Jedna vrstva pro běžný provoz," subtitle="automatizaci i servis.">
      <div className="supla-benefit-list">{[['Ovládání v aplikaci', 'Zapnutí a vypnutí mlžení přes SUPLA při dostupném internetu.'], ['Časové scénáře', 'Provozní okna a cykly podle využití prostoru.'], ['Snadnější servis', 'Varianta s boxem usnadňuje kontrolu a sezónní údržbu.'], ['Rozšíření podle projektu', 'Teplotní, pohybová a průtoková čidla pouze podle zvolené a potvrzené výbavy.']].map(([title, text]) => <div key={title}><strong>{title}</strong><p className="op-txt">{text}</p></div>)}</div>
      <p className="supla-scope-note op-txt">Před instalací ověříme přívod vody, Wi-Fi, internet, bezpečné napájení, umístění elektroniky a zazimování.</p>
    </OfferFlowPage>
    <OfferSuplaVariant c={c} shaft={false} /><OfferSuplaVariant c={c} shaft />
  </div>;
}