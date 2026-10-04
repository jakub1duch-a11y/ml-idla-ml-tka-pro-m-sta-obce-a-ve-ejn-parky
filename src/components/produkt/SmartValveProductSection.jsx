import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Wifi, Droplets, ArrowRight, Clock3, Gauge, Smartphone, Waves, CircleDot } from 'lucide-react';

const VALVE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const PANEL_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e1a4488cb_PEVEKO-SKPB-panel-Jabloshop-800x640.png';

const FEATURES = [
  { icon: Wifi, title: 'Vzdálené ovládání', text: 'Řízení vodní větve podle zvolené smart konfigurace.' },
  { icon: Clock3, title: 'Automatické scénáře', text: 'Časová okna a provozní režimy pro běžný den, víkend nebo akci.' },
  { icon: ShieldCheck, title: 'Bezpečnost', text: 'Možnost automatického uzavření vody při poruše nebo úniku.' },
  { icon: Droplets, title: 'Efektivní provoz', text: 'Mlžení může běžet jen v časech a situacích, kdy má skutečný smysl.' },
  { icon: Gauge, title: 'Nízkotlaký systém', text: 'Řízení zachovává princip provozu podle parametrů konkrétního produktu.' },
  { icon: Smartphone, title: 'Připraveno pro správu', text: 'Vhodné pro města, areály i správce více instalací.' },
];

export default function SmartValveProductSection({ embedded = false, product, onPoptat }) {
  return (
    <section className={`${embedded ? 'bg-white' : 'border-t border-slate-200 bg-slate-50'} py-16 sm:py-20`}> 
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f6fafb_55%,#edf6f8_100%)] shadow-[0_20px_60px_rgba(15,23,42,.06)]">
          <div className="grid gap-0 lg:grid-cols-[.94fr_1.06fr]">
            <div className="p-7 sm:p-9 lg:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-700">Smart řízení · volitelná výbava</p>
              <h2 className="mt-3 font-heading text-3xl font-light leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl">Voda jen tehdy,<br/><span className="text-slate-400">když má mlžení smysl.</span></h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{product?.name || 'Mlžítko'} lze doplnit chytrým řízením přívodu vody. Konfigurace se navrhuje podle konkrétního produktu, lokality, provozní doby a požadované míry automatizace.</p>

              <div className="mt-7 rounded-2xl border border-[#0b4860]/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#0b4860]/60">Princip zapojení · schematicky</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Přívod vody</span>
                  <ArrowRight size={14} className="text-slate-300"/>
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-cyan-800">Smart ventil / řízení</span>
                  <ArrowRight size={14} className="text-slate-300"/>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-2">{product?.name || 'Mlžítko'}</span>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Schéma pouze vysvětluje logiku systému. Skutečné armatury, filtrace, napájení a umístění prvků se řeší podle projektu.</p>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {FEATURES.map(({ icon: Icon, title, text }, index) => (
                  <motion.div key={title} whileHover={{ y: -3 }} className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-[#0b4860]/20 hover:shadow-[0_12px_30px_rgba(11,72,96,.07)]">
                    <div className="flex items-center justify-between"><Icon size={18} className="text-cyan-700"/><CircleDot size={13} className="text-slate-200 transition-colors group-hover:text-cyan-300"/></div>
                    <strong className="mt-3 block text-sm text-slate-950">{title}</strong>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">{text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/smart-ovladani" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#0b4860]/20 bg-white px-6 py-3 text-sm font-semibold text-[#0b4860] transition-all hover:-translate-y-0.5 hover:border-[#0b4860]/35 hover:shadow-sm">Detail Smart ovládání <ArrowRight size={15}/></Link>
                {onPoptat && <button type="button" onClick={onPoptat} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0b4860] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#08394c] hover:shadow-[0_10px_26px_rgba(11,72,96,.18)]">Navrhnout Smart konfiguraci <ArrowRight size={15}/></button>}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-950 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-cyan-300">Řídicí prvky</p><p className="mt-1 text-sm text-white/55">Ilustrační fotografie komponent používaných ve smart řešení.</p></div>
                <Waves size={20} className="text-cyan-300/70"/>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[{img:VALVE_IMG,title:'PEVEKO smart ventil',text:'Prvek pro automatizované řízení a uzavření přívodu vody.'},{img:PANEL_IMG,title:'Řídicí panel PEVEKO',text:'Součást řešení pro chytré a bezpečné řízení instalace.'}].map((item) => (
                  <figure key={item.title} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.05] transition-all hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[.07]">
                    <div className="aspect-[4/3] overflow-hidden bg-white"><img src={item.img} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy"/></div>
                    <figcaption className="p-4 text-xs leading-relaxed text-white/50"><strong className="block text-sm text-white">{item.title}</strong><span className="mt-1 block">{item.text}</span></figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-4 text-[11px] leading-relaxed text-white/45">
                Konkrétní typ řízení a komponenty se potvrzují až podle rozsahu projektu. Tato sekce neslouží jako instalační schéma ani závazná specifikace sestavy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}