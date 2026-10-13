import React from 'react';
import { fmtKc } from '@/components/offers/OfferPageParts';
export default function OfferProductPriceRows({ c }) {
  return <div className="op-summary-table" role="table" aria-label="Produkt, popis a cena">
    <div className="op-summary-row op-summary-head" role="row"><span role="columnheader">Produkt</span><span role="columnheader">Popis / rozsah dodávky</span><span role="columnheader">Cena bez DPH</span></div>
    {c.lines.map((line, i) => <div className="op-summary-row" role="row" key={i}>
      <div role="cell"><b>{line.label}</b><small>{line.quantity || 1} {line.unit || 'ks'}</small></div>
      <div role="cell">{line.description || (i === 0 ? c.product?.short_description || 'Dodávka mlžítka ve zvoleném provedení. Chytré řízení není zahrnuto.' : 'Rozsah dle potvrzené položky.')}</div>
      <strong role="cell">{Number(line.total) > 0 ? fmtKc(line.total) : 'K nacenění'}</strong>
    </div>)}
  </div>;
}