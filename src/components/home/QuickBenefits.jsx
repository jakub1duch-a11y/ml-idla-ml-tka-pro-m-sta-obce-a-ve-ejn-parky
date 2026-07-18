import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CoolingCardEffect from '@/components/home/CoolingCardEffect';
import { ArrowRight, Building2, Cloud, Cog, Droplets, Leaf, PencilRuler, ShieldCheck, ThermometerSnowflake, Truck, Utensils, Wind, Wrench } from 'lucide-react';

export const QUICK_BENEFITS = [
  { icon: Droplets, value: 'Úsporné nízkotlaké mlžení', text: 'Jemná vodní mlha ochlazuje prostor s minimální spotřebou vody.' },
  { icon: ThermometerSnowflake, value: 'Ochlazení až o 12 °C', text: 'Okamžitá úleva pro terasy, parky i frekventovaný veřejný prostor.', to: '/vyuziti' },
  { icon: Leaf, value: 'Ekologické ochlazení', text: 'Příjemnější mikroklima bez klimatizace a bez mokrého efektu.' },
  { icon: Cloud, value: 'Mikromlha 5–15 μm', text: 'Velmi jemné kapénky se odpaří dřív, než dopadnou na povrch.' },
  { icon: Cog, value: 'Nerezová konstrukce', text: 'Precizní komponenty navržené pro dlouhodobý provoz.' },
  { icon: ShieldCheck, value: 'Bezpečný provoz', text: 'Promyšlené řešení pro veřejný prostor.' },
  { icon: Wrench, value: 'Servis a údržba', text: 'Dostupná péče pro spolehlivý provoz v každé sezóně.' },
  { icon: Truck, value: 'Montáž po celé ČR', text: 'Dodávka a instalace po celé zemi.' },
  { icon: Building2, value: 'Pro města a obce', text: 'Nová vrstva letního komfortu pro veřejný prostor.', to: '/vyuziti/mesta-obce' },
  { icon: Utensils, value: 'Restaurace a terasy', text: 'Příjemnější pobyt ve slunečném prostoru.', to: '/vyuziti/hotely' },
  { icon: PencilRuler, value: 'Zakázková výroba', text: 'Přesné řešení na míru konkrétnímu místu.' },
  { icon: Wind, value: 'Okamžité osvěžení', text: 'Jemná mlha se rozprostře do okolního prostoru.' },
];

export default function QuickBenefits({ className = '', compact = false, limit, enableCooling = false }) {
  const benefits = limit ? QUICK_BENEFITS.slice(0, limit) : QUICK_BENEFITS;
  const [coolingIndex] = useState(() => Math.floor(Math.random() * benefits.length));
  return <div className={`grid gap-4 ${className}`}>{benefits.map(({ icon: Icon, value, text, to }, index) => {
    const content = <><div className={`${compact ? 'flex h-10 w-10 items-center justify-center text-cyan' : 'flex h-14 w-14 items-center justify-center text-cyan'} relative z-10`}><Icon size={compact ? 27 : 42} strokeWidth={1.5} /></div><div className={`${compact ? 'min-w-0' : 'mt-5'} relative z-10`}><h3 className={compact ? 'text-sm font-semibold leading-snug text-white' : 'text-xl font-semibold text-white'}>{value}</h3>{compact ? <p className="mt-1 text-xs leading-relaxed text-white/60">{text}</p> : <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>}</div>{compact && to && <ArrowRight size={18} className="relative z-10 ml-auto text-cyan" />}</>;
    const isCoolingCard = compact && enableCooling && index === coolingIndex;
    const classes = `${compact ? 'grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border border-white/10 bg-white/[.04] p-4 text-white transition hover:border-cyan/70 hover:bg-white/[.08]' : 'grid min-h-48 grid-rows-[auto_1fr] rounded-2xl border border-white/25 bg-white/10 p-5 text-white backdrop-blur-xl transition-transform duration-300 hover:scale-[1.03]'} ${isCoolingCard ? 'relative isolate overflow-hidden' : ''}`;
    const cardContent = <><CoolingCardEffect active={isCoolingCard} />{content}</>;
    return to ? <Link key={value} to={to} className={classes} aria-label={`${value}: zobrazit vhodné řešení`}>{cardContent}</Link> : <article key={value} className={classes}>{cardContent}</article>;
  })}</div>;
}