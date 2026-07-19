import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Baby, Building2, Flower2, HeartPulse, Hotel, Palette, Tent, Trees, Waves } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import MistHeroBackground from '@/components/common/MistHeroBackground';
import UsageSegmentSlider from '@/components/vyuziti/UsageSegmentSlider';

const park = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f92ce0ac4_IMG_3518.jpg';
const detail = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/72ab2f053_IMG_3494.jpg';
const gate = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bd29c555a_f16a9c3ea_generated_image.png';
const segments = [
  ['Města a obce','Ochlazení náměstí, pěších zón a míst pro setkávání.','Až −10 °C · méně prachu · bezpečné osvěžení','/vyuziti/mesta-obce',Building2,gate],
  ['Parky a hřiště','Příjemnější veřejný prostor pro rodiny, sport a každodenní setkávání.','Komfort návštěvníků · aktivní venkovní prostor','/vyuziti/parky-hriste',Trees,park],
  ['Školy, školky a děti','Bezpečný pohyb a hravé osvěžení během tropických dnů.','Prevence přehřátí · hravý design · časovač','/vyuziti/skoly-skolky-deti',Baby,park],
  ['Domovy seniorů','Klidná odpočinková zóna s nižším tepelným stresem.','Tichý provoz · příjemné letní mikroklima','/vyuziti/domovy-senioru',HeartPulse,detail],
  ['Hotely a restaurace','Komfortnější terasa prodlužuje příjemný pobyt hostů.','Vyšší atraktivita · chytré řízení','/vyuziti/hotely',Hotel,gate],
  ['Wellness terasy','Jemná mlha doplňuje relaxační a bazénové zóny.','Prémiový zážitek · klidná atmosféra','/vyuziti/wellness-terasy',Waves,detail],
  ['Koupaliště a aquaparky','Osvěžení vstupů, front a odpočinkových ploch.','Komfort u vody · sezónní provoz','/vyuziti/koupaliste',Waves,gate],
  ['Pro architekty','Mlha jako funkční materiál a výrazný prvek návrhu.','Nerezová konstrukce · řešení na míru','/vyuziti/architekti',Palette,park],
  ['Eventy a festivaly','Mobilní mlžící zóny pro letní akce a davy.','Rychlá instalace · možnost pronájmu','/vyuziti/eventy',Tent,gate],
  ['Outdoor a zahrady','Osvěžení soukromých teras, pergol a posezení.','Komfort doma · čistá instalace','/vyuziti/outdoor-zahrady',Flower2,detail],
  ['Komerční prostory','Příjemnější prostředí pro retail a firemní areály.','Plynulý provoz · automatizace','/vyuziti/komercni',Building2,gate],
  ['Art instalace','Zakázkové mlžné skulptury pro kulturní prostor.','Autorský návrh · scénické řízení','/vyuziti/art-instalace',Palette,park],
];

export default function Vyuziti() {
  useEffect(() => setSEO({ title: 'B2B využití mlžítek | Mlzidla.cz', description: 'Mlžítka pro veřejné, komerční, pečovatelské a relaxační prostory.', canonicalPath: '/vyuziti' }), []);
  return <main className="min-h-screen bg-white"><section className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36"><MistHeroBackground /><div className="site-container relative z-10"><p className="content-eyebrow text-cyan">B2B využití</p><h1 className="mt-4 max-w-3xl text-white">Mlha pro prostor, kde na pohodlí záleží.</h1><p className="mt-6 max-w-2xl text-lg text-white/70">Vyberte typ místa a prohlédněte si přínosy, vhodné modely i způsob provozu.</p></div></section><section className="site-container py-14 lg:py-20"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{segments.map(([title,text,benefits,path,Icon,image]) => <Link key={path} to={path} className="group relative flex min-h-72 overflow-hidden border border-slate-200 p-6"><img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" /><div className="absolute inset-0 bg-white transition group-hover:bg-slate-950/78" /><div className="relative z-10 flex w-full flex-col"><Icon size={23} className="mb-8 text-techblue" /><h2 className="m-0 text-xl text-slate-950 group-hover:text-white">{title}</h2><p className="mt-3 text-sm text-slate-600 group-hover:text-white/75">{text}</p><p className="mt-auto pt-6 text-xs font-bold text-techblue group-hover:text-cyan">{benefits}</p><ArrowRight size={16} className="mt-4 text-slate-400 group-hover:text-white" /></div></Link>)}</div></section><UsageSegmentSlider /></main>;
}