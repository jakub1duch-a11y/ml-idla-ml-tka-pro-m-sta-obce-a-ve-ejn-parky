import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Power, CircleCheck, Clock3 } from 'lucide-react';
import PevekoValveFlow from '@/components/smart-ovladani/PevekoValveFlow';

const FEATURES = [
  { icon: Power, text: 'Otevření a uzavření vody z mobilu' },
  { icon: CircleCheck, text: 'Přehled stavu ventilu v aplikaci' },
  { icon: Clock3, text: 'Časový plán podle konfigurace' },
];

export default function SmartValveProductSection({ embedded = false, product, onPoptat }) {
  return (
    <section className={`${embedded ? 'bg-white' : 'bg-slate-50'} py-14 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-7 overflow-hidden rounded-[2rem] bg-gradient-to-br from-white to-[#edf7f9] p-5 shadow-[0_20px_60px_rgba(15,23,42,.06)] sm:p-8 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:p-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-700">PEVEKO + SUPLA · volitelné řízení</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-[-.035em] text-[#082f3f] sm:text-4xl">Vodu ovládáte.<br />Z mobilu.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{product?.name || 'Mlžítko'} lze doplnit chytrým ventilem PEVEKO s ovládáním přes SUPLA. Otevření, uzavření i stav vodní větve máte přehledně v aplikaci.</p>
            <div className="mt-6 space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => <p key={text} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><Icon size={18} className="shrink-0 text-cyan-700" aria-hidden="true" />{text}</p>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {onPoptat && <button type="button" onClick={onPoptat} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#073142] px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">Navrhnout chytré řízení <ArrowRight size={15} aria-hidden="true" /></button>}
              <Link to="/smart-ovladani" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-cyan-900 shadow-sm transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">Jak funguje chytré řízení <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Konkrétní model a zapojení navrhujeme podle produktu, místa a režimu provozu.</p>
          </div>
          <PevekoValveFlow theme="light" />
        </div>
      </div>
    </section>
  );
}
