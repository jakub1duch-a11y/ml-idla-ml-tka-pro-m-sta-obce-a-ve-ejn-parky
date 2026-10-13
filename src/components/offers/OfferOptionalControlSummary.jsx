import React from 'react';
import { fmtKc } from '@/components/offers/OfferPageParts';
export default function OfferOptionalControlSummary({ total }) {
  return <section className="op-control-summary">
    <h4 className="op-bold">Volitelné chytré řízení SUPLA</h4>
    <p className="op-txt"><b>Mlžítko funguje i bez chytrého řízení.</b> SUPLA není podmínkou nákupu ani součástí základní ceny.</p>
    <div className="op-control-options">
      <div><span className="op-cap">A / bez servisní šachty</span><h4 className="op-bold">SUPLA řízení</h4><p className="op-txt">Wi-Fi ovládání a časové režimy; chráněný servisní prostor se řeší samostatně.</p><strong className="op-control-price">{fmtKc(29639)} <small>bez DPH</small></strong></div>
      <div><span className="op-cap">B / se servisní šachtou</span><h4 className="op-bold">SUPLA + otevíratelná zemní šachta</h4><p className="op-txt">{fmtKc(29639)} řízení + {fmtKc(18900)} šachta.</p><strong className="op-control-price">{fmtKc(48539)} <small>bez DPH</small></strong></div>
    </div>
    {total > 0 && <div className="op-control-combinations"><span>Základ + A <b>{fmtKc(total + 29639)}</b></span><span>Základ + B <b>{fmtKc(total + 48539)}</b></span></div>}
    <p className="op-cap">Ceny kombinací jsou bez DPH. Vyberte jen jednu variantu; alternativy se nesčítají ani automaticky nepřičítají.</p>
  </section>;
}