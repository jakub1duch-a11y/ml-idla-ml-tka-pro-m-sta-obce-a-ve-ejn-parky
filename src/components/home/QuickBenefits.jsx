import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CoolingCardEffect from '@/components/home/CoolingCardEffect';
import { ArrowRight, Building2, Cloud, Cog, Droplets, Leaf, PencilRuler, ShieldCheck, ThermometerSnowflake, Truck, Utensils, Wind, Wrench } from 'lucide-react';

export const QUICK_BENEFITS = [
{ icon: Droplets, value: 'Úsporné nízkotlaké mlžení', text: 'Jemná vodní mlha ochlazuje prostor s minimální spotřebou vody.', detail: 'Pracovní tlak 2–8 bar · cílené mlžení bez mokrého efektu' },
{ icon: ThermometerSnowflake, value: 'Ochlazení až o 12 °C', text: 'Okamžitá úleva pro terasy, parky i frekventovaný veřejný prostor.', detail: 'Pocitové ochlazení v aktivní zóně · okamžitý efekt', to: '/vyuziti' },
{ icon: Leaf, value: 'Ekologické ochlazení', text: 'Příjemnější mikroklima bez klimatizace a bez mokrého efektu.', detail: 'Voda se mění na jemnou mlhu · bez energeticky náročné klimatizace' },
{ icon: Cloud, value: 'Jemná mlha 50–100 μm', text: 'Jemné kapénky vytvářejí viditelný osvěžující oblak.', detail: 'Kapénky 50–100 μm · rovnoměrné rozprostření v prostoru' },
{ icon: Cog, value: 'Nerezová konstrukce', text: 'Precizní komponenty navržené pro dlouhodobý provoz.', detail: 'Nerez AISI 316L · odolné provedení pro venkovní použití' },
{ icon: ShieldCheck, value: 'Bezpečný provoz', text: 'Promyšlené řešení pro veřejný prostor.', detail: 'Navrženo pro pohyb lidí · komfortní a přehledná instalace' },
{ icon: Wrench, value: 'Servis a údržba', text: 'Dostupná péče pro spolehlivý provoz v každé sezóně.', detail: 'Sezónní kontrola · snadná údržba systému' },
{ icon: Truck, value: 'Montáž po celé ČR', text: 'Dodávka a instalace po celé zemi.', detail: 'Návrh, dodávka i odborná montáž na jednom místě' },
{ icon: Building2, value: 'Pro města a obce', text: 'Nová vrstva letního komfortu pro veřejný prostor.', detail: 'Parky, pěší zóny i náměstí · řešení na míru místu', to: '/vyuziti/mesta-obce' },
{ icon: Utensils, value: 'Restaurace a terasy', text: 'Příjemnější pobyt ve slunečném prostoru.', detail: 'Více komfortu pro hosty · příjemnější letní provoz', to: '/vyuziti/hotely' },
{ icon: PencilRuler, value: 'Zakázková výroba', text: 'Přesné řešení na míru konkrétnímu místu.', detail: 'Tvar, rozsah i rozmístění podle prostoru' },
{ icon: Wind, value: 'Okamžité osvěžení', text: 'Jemná mlha se rozprostře do okolního prostoru.', detail: 'Aktivace během okamžiku · viditelný mlžný efekt' }];


export default function QuickBenefits({ className = '', compact = false, limit, enableCooling = false }) {
  const benefits = limit ? QUICK_BENEFITS.slice(0, limit) : QUICK_BENEFITS;
  const [coolingIndex] = useState(() => Math.floor(Math.random() * benefits.length));
  const [openIndex, setOpenIndex] = useState(null);

  return <div className={`grid gap-4 right-6 top-1/2 right-450 w-[500px] top-10 ${className}`}>{benefits.map(({ icon: Icon, value, text, detail, to }, index) => {
      const isOpen = openIndex === index;
      const isCoolingCard = compact && enableCooling && index === coolingIndex;
      const compactContent = <><div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan"><Icon size={32} strokeWidth={1.5} /></div><div className="relative z-10 min-w-0"><h3 className="text-base font-semibold leading-snug text-white">{value}</h3><p className="text-xs leading-relaxed text-white/60">{text}</p><p className={`overflow-hidden text-xs leading-relaxed text-cyan transition-all duration-300 ${isOpen ? 'mt-3 max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>{detail}</p></div>{to && <Link to={to} onClick={(event) => event.stopPropagation()} className="relative z-10 ml-auto shrink-0 rounded-full p-2 text-cyan" aria-label={`${value}: zobrazit vhodné řešení`}><ArrowRight size={20} /></Link>}</>;
      const standardContent = <><div className="relative z-10 flex h-14 w-14 items-center justify-center text-cyan"><Icon size={42} strokeWidth={1.5} /></div><div className="relative z-10 mt-5"><h3 className="text-xl font-semibold text-white">{value}</h3><p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p></div></>;
      const classes = `${compact ? 'group grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 border border-white/10 bg-white/[.04] p-3 text-left text-white transition hover:border-cyan/70 hover:bg-cyan/[.08]' : 'grid min-h-48 grid-rows-[auto_1fr] rounded-2xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-xl transition-transform duration-300 hover:scale-[1.03]'} ${isCoolingCard ? 'relative isolate overflow-hidden' : ''}`;
      const content = <><CoolingCardEffect active={isCoolingCard} />{compact ? compactContent : standardContent}</>;
      if (compact) return <article key={value} tabIndex="0" onClick={() => setOpenIndex(isOpen ? null : index)} onKeyDown={(event) => event.key === 'Enter' && setOpenIndex(isOpen ? null : index)} className={classes}>{content}</article>;
      return to ? <Link key={value} to={to} className={classes}>{content}</Link> : <article key={value} className={classes}>{content}</article>;
    })}</div>;
}