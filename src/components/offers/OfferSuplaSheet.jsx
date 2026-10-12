import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
import OfferSuplaDiagram from '@/components/offers/OfferSuplaDiagram';
import { fmtKc } from '@/components/offers/OfferPageParts';
export default function OfferSuplaSheet({ c }) {
  return <OfferFlowPage title="Chytré řízení SUPLA" subtitle="Dvě volitelné varianty provedení.">
    <p className="op-txt">Časové plány, ovládání z mobilu a volitelné senzory podle výbavy. Grafika je koncepční schéma, nikoli montážní dokumentace nebo živé ovládání.</p>
    {[true, false].map(shaft => <section className="op-supla-option" key={String(shaft)}><h3 className="op-h2">SUPLA {shaft ? 'se šachtou' : 'bez šachty'}</h3><OfferSuplaDiagram shaft={shaft}/><p className="op-txt">{shaft ? 'Technologie v servisně přístupné šachtě. Ověříme odvodnění, ochranu proti zaplavení a mrazu, signál a bezpečné napájení.' : 'Technologie v chráněném prostoru nebo rozvaděči. Ověříme krytí, přívod vody, signál, napájení a zazimování.'}</p><p className="op-bold op-green">Cena kompletní varianty: k individuálnímu nacenění.</p></section>)}
    <p className="op-txt">{c.suplaPrice > 0 ? `Ceníkový základ řízení SUPLA: ${fmtKc(c.suplaPrice)} bez DPH. Není cenou celé varianty se šachtou nebo bez šachty.` : 'Ceníkový základ není dostupný; cenu potvrdí obchodník.'} Stavební část, montáž a vybraná sestava se nacení samostatně. Varianty se automaticky nepřičítají k nabídce.</p>
  </OfferFlowPage>;
}