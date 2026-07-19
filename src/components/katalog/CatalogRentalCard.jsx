import React from 'react';
import { ArrowRight, CalendarDays, Check, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const points = ['Festivaly, firemní eventy, soukromé akce a letní programy', 'Doprava, instalace, technik na místě a plná provozní podpora', 'Mrak, BENDY, OSTREV, AURA, LÍZÁTKO nebo mlžná brána GATE', 'Jedno mlžítko i kompletní zóna s více prvky podle vašich požadavků'];

export default function CatalogRentalCard() {
  return <section className="bg-slate-50 py-16 lg:py-24">
    <div className="site-container overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white">
      <div className="grid lg:grid-cols-2">
        <div className="p-8 lg:p-14"><p className="content-eyebrow mb-4 text-cyan">Pronájem mlžítek</p><h2 className="content-title text-white">Mlžné osvěžení pro letní akce a eventy.</h2><p className="mt-5 text-white/60">Pošlete nám svou představu. Cena pronájmu zahrnuje návrh počtu zařízení, rozmístění a provozu. Vytvoříme mlžící zónu a zajistíme technika i podporu po celou dobu konání.</p><ul className="mt-7 space-y-3">{points.map(point => <li key={point} className="flex items-center gap-3 text-sm text-white/75"><Check size={16} className="text-cyan" />{point}</li>)}</ul><Link to="/poptavka?produkt=Pronájem%20mlžítek" className="btn-metallic-mist mt-8 px-7 py-4 text-sm font-bold">Poptat termín pronájmu <ArrowRight size={16} /></Link></div>
        <div className="relative min-h-80 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.2),transparent_60%)]"><CalendarDays className="absolute left-10 top-10 text-cyan" size={42} /><Truck className="absolute bottom-10 right-10 text-white/30" size={54} /><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png" alt="Mlžná brána GATE k pronájmu" className="h-full w-full object-contain p-8" /></div>
      </div>
    </div>
  </section>;
}