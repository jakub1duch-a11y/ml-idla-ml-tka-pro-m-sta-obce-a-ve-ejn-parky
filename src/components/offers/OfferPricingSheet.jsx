import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
import { fmtKc } from '@/components/offers/OfferPageParts';
export default function OfferPricingSheet({ c, recap = false, children }) {
  return <OfferFlowPage title={recap ? 'Rekapitulace a podmínky' : 'Cenová nabídka'} subtitle={c.forWhom}>
    <p className="op-txt">{c.productName} · Nabídka {c.quoteNumber || '—'} · platnost do {c.validUntil}</p>
    <div className="op-price-list">{c.lines.map((line, i) => <div className="op-price-row" key={i}><div><b>{line.label}</b><small>{line.quantity || 1} {line.unit || 'ks'}</small></div><strong className="op-green">{Number(line.total) > 0 ? fmtKc(line.total) : 'K nacenění'}</strong></div>)}</div>
    <div className="op-price-totals"><div><span>Celkem bez DPH</span><strong>{c.total > 0 ? fmtKc(c.total) : 'K nacenění'}</strong></div>{c.total > 0 && <><div><span>DPH 21 %</span><span>{fmtKc(Math.round(c.total * .21))}</span></div><div className="op-green"><b>Celkem s DPH</b><strong>{fmtKc(Math.round(c.total * 1.21))}</strong></div></>}</div>
    <p className="op-txt">Rozhodující je rozsah uvedených položek. Volitelné varianty SUPLA se automaticky nepřičítají. Neoceněné položky vyžadují doplnění před odesláním.</p>
    {children}
  </OfferFlowPage>;
}