import React from 'react';
import { Logo } from '@/components/offers/OfferPageParts';
export default function OfferFlowPage({ title, subtitle, children }) {
  return <div className="offer-page op-flow-page"><Logo /><header className="op-flow-heading"><h2 className="op-h1">{title}</h2>{subtitle && <p className="op-sub op-green">{subtitle}</p>}</header><div className="op-flow-content">{children}</div></div>;
}