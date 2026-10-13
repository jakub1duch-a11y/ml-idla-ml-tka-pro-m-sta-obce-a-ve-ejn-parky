import React from 'react';
import { Clock, Thermometer, Smartphone, BarChart3, SlidersHorizontal, Smile, TreeDeciduous, Home, Paintbrush, Leaf, Coins, Truck, Package, Cloud } from 'lucide-react';
import { Logo, Bg, ProductTitle, IconRow, fmtKc, CONTACT } from './OfferPageParts';
import OfferPlacementSheets from '@/components/offers/OfferPlacementSheets';
import OfferSuplaSheet from '@/components/offers/OfferSuplaSheet';
import OfferPricingSheet from '@/components/offers/OfferPricingSheet';
import OfferPortalContact from '@/components/offers/OfferPortalContact';

export function PlacementPage({ c }) { return <OfferPlacementSheets c={c}/>; }
export function SmartPage({ c }) { return <OfferSuplaSheet c={c}/>; }
export function PricePage({ c }) { return <OfferPricingSheet c={c}/>; }

export function DarkHeroPage({ c }) {
  return (
    <div className="offer-page op-dark">
      {c.pick(1) && <Bg src={c.pick(1)} style={{ opacity: .85 }} />}
      <div className="op-abs" style={{ left: 0, right: 0, bottom: '6%', textAlign: 'center', color: '#fff', background: 'rgba(17,22,19,.88)', padding: '3cqw' }}>
        <div className="op-h2" style={{ fontSize: '6cqw', color: '#fff' }}><ProductTitle name={c.productName} /></div>
        <div className="op-rule" style={{ margin: '1.4cqw auto 0' }} />
      </div>
    </div>
  );
}

export function PhotoHeroPage({ c }) {
  return (
    <div className="offer-page">
      <Bg src={c.pick(2)} />
      <div className="op-abs" style={{ inset: '0 0 60% 0', background: 'linear-gradient(180deg,rgba(251,252,248,.98),rgba(251,252,248,.92),transparent)' }} />
      <div className="op-abs" style={{ left: '7cqw', top: '10cqw', zIndex: 3 }}>
        <div className="op-h1" style={{ fontSize: '7.4cqw' }}><ProductTitle name={c.productName} /></div>
        <div className="op-rule" />
        <div className="op-sub" style={{ marginTop: '2.6cqw' }}>Příjemné letní osvěžení</div>
      </div>
    </div>
  );
}

export function RecapPage({ c }) {
  return <OfferPricingSheet c={c} recap>
    <p className="op-txt">Platnost do {c.validUntil}. Termín, platební podmínky a rozsah instalace budou potvrzeny. Vizualizace jsou koncepční a vyžadují kontrolu produktu a technické proveditelnosti.</p>
    <p className="op-txt">Objednávku potvrdíte po přihlášení ve svém projektu; samotné otevření odkazu nebo QR kódu není objednávkou.</p>
    <OfferPortalContact />
  </OfferPricingSheet>;
}