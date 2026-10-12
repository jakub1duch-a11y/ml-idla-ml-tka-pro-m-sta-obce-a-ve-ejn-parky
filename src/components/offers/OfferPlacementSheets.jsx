import React from 'react';
import OfferFlowPage from '@/components/offers/OfferFlowPage';
export default function OfferPlacementSheets({ c }) {
  const scenes = c.scenes?.length ? c.scenes : c.viz.map((url, i) => ({ url, title: `Vizualizace ${i + 1}`, caption: 'Koncepční vizualizace ke kontrole' }));
  const groups = Array.from({ length: Math.max(1, Math.ceil(scenes.length / 2)) }, (_, i) => scenes.slice(i * 2, i * 2 + 2));
  return <>{groups.map((group, i) => <OfferFlowPage key={i} title="Návrh umístění." subtitle={c.sourcePhotos?.length ? 'Prostor klienta z různých úhlů.' : 'Možnosti začlenění do prostoru.'}>
    {group.length ? group.map(s => <figure className="op-scene" key={s.url}><h3 className="op-bold op-green">{s.title}</h3><img src={s.url} alt={`${c.productName} – ${s.title}`} /><figcaption className="op-txt">{s.caption || 'Ilustrační návrh, nikoli dokumentace skutečné realizace.'}</figcaption></figure>) : <p className="op-txt">Vizualizace budou doplněny při generování nabídky.</p>}
    <p className="op-cap">Nové úhly jsou koncepční rekonstrukce. Skutečné rozměry, kotvení a přípojky musí ověřit technik.</p>
  </OfferFlowPage>)}</>;
}