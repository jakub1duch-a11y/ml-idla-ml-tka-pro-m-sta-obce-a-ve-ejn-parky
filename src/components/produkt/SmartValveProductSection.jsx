import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wifi, Droplets, ArrowRight, Clock3, Gauge, Smartphone } from 'lucide-react';

const VALVE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const PANEL_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e1a4488cb_PEVEKO-SKPB-panel-Jabloshop-800x640.png';

export default function SmartValveProductSection({ embedded = false, product, onPoptat }) {
  return (
    <section className={`${embedded ? 'bg-white' : 'border-t border-slate-200 bg-slate-50'} py-16 sm:py-20`}> 
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-700">Smart řízení · volitelná výbava</p>
            <h2 className="mt-3 font-heading text-3xl leading-tight text-slate-950 sm:text-4xl">Voda jen tehdy, když je potřeba.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{product?.name || 'Mlžítko'} lze doplnit chytrým ventilem PEVEKO pro vzdálené ovládání přívodu vody, automatické scénáře a rychlé uzavření systému při nechtěném úniku. Konfiguraci nastavujeme podle místa, provozní doby a požadované míry automatizace.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Wifi size={18} className="text-cyan-700"/><strong className="mt-3 block text-sm text-slate-950">Vzdálené ovládání</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Řízení vodní větve podle zvolené smart konfigurace.</span></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Clock3 size={18} className="text-cyan-700"/><strong className="mt-3 block text-sm text-slate-950">Automatické scénáře</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Časová okna a provozní režimy pro běžný den, víkend nebo akci.</span></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><ShieldCheck size={18} className="text-cyan-700"/><strong className="mt-3 block text-sm text-slate-950">Bezpečnost</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Možnost automatického uzavření vody při poruše nebo úniku.</span></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Droplets size={18} className="text-cyan-700"/><strong className="mt-3 block text-sm text-slate-950">Efektivní provoz</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Mlžení může běžet jen v časech a situacích, kdy má skutečný smysl.</span></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Gauge size={18} className="text-cyan-700"/><strong className="mt-3 block text-sm text-slate-950">Nízkotlaký systém</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Řízení zachovává princip provozu přímo z vodovodního řádu bez vysokotlakého čerpadla.</span></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4"><Smartphone size={18} className="text-cyan-700"/><strong className="mt-3 block text-sm text-slate-950">Připraveno pro správu</strong><span className="mt-1 block text-xs leading-relaxed text-slate-500">Vhodné pro města, areály i správce více instalací.</span></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/smart-ovladani" className="btn-secondary-outline inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-900">Detail Smart ovládání <ArrowRight size={15}/></Link>
              {onPoptat && <button type="button" onClick={onPoptat} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0b4860] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#08394c]">Navrhnout Smart konfiguraci <ArrowRight size={15}/></button>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white"><img src={VALVE_IMG} alt="Chytrý ventil PEVEKO pro řízení přívodu vody k mlžítku" className="aspect-[4/3] w-full object-cover" loading="lazy"/><figcaption className="p-4 text-xs leading-relaxed text-slate-500"><strong className="block text-sm text-slate-900">PEVEKO smart ventil</strong>Automatizované řízení a uzavření přívodu vody.</figcaption></figure>
            <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white"><img src={PANEL_IMG} alt="PEVEKO ovládací panel chytrého ventilu" className="aspect-[4/3] w-full object-cover" loading="lazy"/><figcaption className="p-4 text-xs leading-relaxed text-slate-500"><strong className="block text-sm text-slate-900">Řídicí panel PEVEKO</strong>Součást řešení pro chytré a bezpečné řízení instalace.</figcaption></figure>
          </div>
        </div>
      </div>
    </section>
  );
}
