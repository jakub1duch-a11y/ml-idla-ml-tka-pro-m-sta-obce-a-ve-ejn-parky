import React from 'react';
import { Clock, Thermometer, Smartphone, Droplets, ShieldCheck, Sparkles, Users, Leaf, Maximize2, Layers, Anchor, Sun } from 'lucide-react';
import { Logo, Bg, ProductTitle, IconRow } from './OfferPageParts';
import OfferFlowPage from '@/components/offers/OfferFlowPage';

const DEFAULT_BENEFITS = [
  { icon: Droplets, title: 'Jemná vodní mlha', text: 'Příjemně ochlazuje, zvlhčuje vzduch a vytváří svěží prostředí.' },
  { icon: ShieldCheck, title: 'Bezpečné a atraktivní řešení', text: 'Moderní design, který splňuje vysoké nároky na bezpečnost.' },
  { icon: Sparkles, title: 'Nerezová konstrukce', text: 'Kvalitní nerezová ocel pro dlouhou životnost a minimální údržbu.' },
  { icon: Users, title: 'Vhodné pro školy, parky a zahrady', text: 'Ideální pro veřejná prostranství i soukromé zahrady.' },
  { icon: Leaf, title: 'Nízké provozní náklady', text: 'Úsporný provoz a efektivní chlazení s minimální spotřebou vody.' },
];
const ICONS = [Droplets, ShieldCheck, Sparkles, Users, Leaf];

export function CoverPage({ c }) {
  return <OfferFlowPage title="Designová mlžítka." subtitle="Chytrý provoz.">
    <h3 className="op-h2" style={{ fontSize: '5cqw' }}><ProductTitle name={c.productName}/></h3>
    {c.pick(0) && <img src={c.pick(0)} className="op-flow-photo" alt={c.productName}/>}
    <p className="op-sub">{c.forWhom}</p><p className="op-txt">Česká nerezová řešení pro města, parky a zahrady.</p>
    <p className="op-cap">Koncepční vizualizace ke kontrole. Chytré řízení SUPLA jako volitelná provozní vrstva.</p>
  </OfferFlowPage>;
}

export function SolutionPage({ c }) {
  return <OfferFlowPage title="Řešení pro váš prostor" subtitle={c.forWhom}>
    <p className="op-txt">{c.goal}</p><p className="op-txt">{c.solution}</p>
    {c.pick(0) && <img className="op-flow-photo" src={c.pick(0)} alt={c.productName}/>}
    {c.benefits.map(b => <p className="op-txt" key={b}>{b}</p>)}
    <p className="op-cap">Vizualizace je koncepční návrh; umístění a technické návaznosti potvrdí technik.</p>
  </OfferFlowPage>;
}

export function TechPage({ c }) {
  const p = c.product || {};
  return <OfferFlowPage title="Technické informace" subtitle={c.productName}>
    {[["Materiál", p.material], ["Pracovní tlak", p.pressure], ["Spotřeba vody", p.water_consumption], ["Velikost kapek", p.micron_size], ["Pokrytí", p.coverage_area], ["Napájení", p.power_supply]].map(([label, value]) => <div key={label}><h3 className="op-bold">{label}</h3><p className="op-txt">{value || 'K technickému ověření'}</p></div>)}
    <p className="op-txt">Technické hodnoty neodvozujeme z fotografie. Kotvení, přívod vody, ochrana elektroinstalace a servisní přístup vyžadují projektovou kontrolu.</p>
  </OfferFlowPage>;
}