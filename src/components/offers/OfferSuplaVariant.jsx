import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
import OfferSuplaDiagram from '@/components/offers/OfferSuplaDiagram';
import { fmtKc } from '@/components/offers/OfferPageParts';
import { SUPLA_VISUALS } from '@/components/offers/suplaVisuals';
export default function OfferSuplaVariant({ c, shaft }) {
  const total = shaft ? 48539 : 29639;
  return <OfferFlowPage title={`Varianta ${shaft ? 'B' : 'A'}`} subtitle={shaft ? 'Se servisní šachtou' : 'Bez servisní šachty'}>
    <div className="supla-price-band"><strong>{fmtKc(total)}</strong><span>bez DPH · volitelné rozšíření</span></div>
    <img className="supla-variant-image" src={shaft ? SUPLA_VISUALS.shaft : SUPLA_VISUALS.valve} alt={shaft ? 'Koncepční šachtový rozvod s filtrací, ventilem a řízením SUPLA' : 'Koncepční chytrý ventil, SUPLA modul a mobilní aplikace'} />
    <p className="op-cap">Ilustrační konfigurace. Rozsah hardware a montážní provedení podléhají technickému potvrzení.</p>
    <OfferSuplaDiagram shaft={shaft} />
    <div className="op-price-list"><div className="op-price-row"><b>SUPLA řízení / Wi-Fi / aplikace</b><strong>{fmtKc(29639)}</strong></div>{shaft && <div className="op-price-row"><b>Servisní šachta / box</b><strong>{fmtKc(18900)}</strong></div>}</div>
    <div className="op-price-totals"><div><b>Automatizace celkem bez DPH</b><strong>{fmtKc(total)}</strong></div>{c.total > 0 && <div><span>Produkt + varianta {shaft ? 'B' : 'A'}</span><strong>{fmtKc(c.total + total)}</strong></div>}</div>
    <p className="op-txt">{shaft ? 'Servisní přístup shora pro snadnou kontrolu, údržbu a zazimování. Ověříme odvodnění, ochranu proti zaplavení a mrazu a dostupnost Wi-Fi signálu.' : 'Instalace do existujícího chráněného servisního prostoru. Ověříme krytí, přívod vody, napájení, Wi-Fi signál a zazimování.'}</p>
    <p className="supla-scope-note op-txt">Alternativy se nesčítají a nepřičítají automaticky. Doprava, montáž v místě, výkopy, stavební práce a další senzory nejsou zahrnuty.</p>
  </OfferFlowPage>;
}