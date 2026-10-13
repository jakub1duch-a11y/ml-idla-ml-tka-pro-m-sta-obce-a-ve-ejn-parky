import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
import { fmtKc } from '@/components/offers/OfferPageParts';
import OfferProductPriceRows from '@/components/offers/OfferProductPriceRows';
import OfferOptionalControlSummary from '@/components/offers/OfferOptionalControlSummary';
import '@/components/offers/offerPricing.css';
export default function OfferPricingSheet({ c, recap = false, children }) {
  const photo = c.scenes?.[0]?.url || c.product?.visual_master_reference_url || c.product?.image_url;
  return <div className="op-price-sheet"><OfferFlowPage title={recap ? 'Shrnutí nabídky a další krok' : 'Produkt. Popis. Cena.'} subtitle={c.forWhom}>
    <p className="op-cap">Nabídka {c.quoteNumber || '—'} / platnost do {c.validUntil}</p>
    {!recap && <div className="op-price-photo">{photo && <img src={photo} alt={`Produktový podklad ${c.productName}`} />}<div><h3>{c.productName}</h3><p className="op-txt">{c.product?.short_description || c.solution || 'Dodávka mlžítka ve zvoleném provedení.'}</p></div></div>}
    <OfferProductPriceRows c={c} />
    <div className="op-price-totals"><div><b>Základní dodávka bez DPH</b><strong>{c.total > 0 ? fmtKc(c.total) : 'K nacenění'}</strong></div>{c.total > 0 && <><div><span>DPH 21 %</span><span>{fmtKc(Math.round(c.total * .21))}</span></div><div className="op-green"><span>Základní dodávka s DPH</span><strong>{fmtKc(Math.round(c.total * 1.21))}</strong></div></>}</div>
    <OfferOptionalControlSummary total={c.total} />
    <p className="op-cap">Doprava, montáž, výkopy a stavební práce jsou zahrnuty pouze tehdy, jsou-li výslovně oceněny výše. Neoceněné položky vyžadují potvrzení.</p>
    {children}
  </OfferFlowPage></div>;
}