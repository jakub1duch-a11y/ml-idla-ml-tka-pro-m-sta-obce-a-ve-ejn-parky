import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Baby, Building2, Flower2, HeartPulse, Hotel, Palette, Tent, Trees, Waves } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import MistHeroBackground from '@/components/common/MistHeroBackground';
import UsageSegmentSlider from '@/components/vyuziti/UsageSegmentSlider';

const segments = [
  { title: 'Města a obce', text: 'Efektivní nástroj pro boj s městskými tepelnými ostrovy. Mlžítka promění rozpálený beton v příjemnou oázu pro občany i turisty.', benefits: 'Až −10 °C · méně prachu · bezpečné osvěžení', path: '/vyuziti/mesta-obce', icon: Building2 },
  { title: 'Parky a hřiště', text: 'Příjemnější veřejný prostor pro rodiny, sport i každodenní setkávání během horkých dnů.', benefits: 'Komfort návštěvníků · aktivní venkovní prostor', path: '/vyuziti/parky-hriste', icon: Trees },
  { title: 'Školy, školky a děti', text: 'Ochrana nejmenších před přehřátím a bezpečný pohyb venku i za tropických dnů.', benefits: 'Prevence úžehu · hravý design · časovač', path: '/vyuziti/skoly-skolky-deti', icon: Baby },
  { title: 'Domovy seniorů', text: 'Teplotní komfort pro citlivou skupinu obyvatel. Mlžení pomáhá tělu přirozeně regulovat teplotu bez šoku z klimatizace.', benefits: 'Méně tepelného stresu · prevence kolapsů', path: '/vyuziti/domovy-senioru', icon: HeartPulse },
  { title: 'Hotely a restaurace', text: 'Proměňte letní terasu v oblíbené místo. Příjemně chlazený vzduch prodlužuje pobyt hostů.', benefits: 'Vyšší obsazenost · méně obtížného hmyzu', path: '/vyuziti/hotely', icon: Hotel },
  { title: 'Wellness terasy', text: 'Jemná mlha vytváří příjemnou přechodovou zónu mezi saunou, bazénem a venkovním odpočinkem.', benefits: 'Atraktivnější spa · zážitek pro klienty', path: '/vyuziti/wellness-terasy', icon: Waves },
  { title: 'Koupaliště a aquaparky', text: 'Chladivé zóny pro návštěvníky v místech s intenzivním letním provozem.', benefits: 'Osvěžení ve frontách · komfort u vody', path: '/vyuziti/koupaliste', icon: Waves },
  { title: 'Pro architekty', text: 'Mlha jako funkční materiál návrhu i výrazný prvek veřejného prostoru.', benefits: 'Nerezová konstrukce · řešení na míru', path: '/vyuziti/architekti', icon: Palette },
  { title: 'Eventy a festivaly', text: 'Mobilní mlžné konstrukce pro krátkodobé letní akce a bezpečné ochlazení davů.', benefits: 'Rychlá instalace · sezónní provoz', path: '/vyuziti/eventy', icon: Tent },
  { title: 'Outdoor a zahrady', text: 'Příjemná venkovní oáza pro soukromé terasy, pergoly a zahradní posezení.', benefits: 'Komfort doma · nenápadná instalace', path: '/vyuziti/outdoor-zahrady', icon: Flower2 },
  { title: 'Komerční prostory', text: 'Komfortní prostředí pro retail, showroomy, firemní areály a jejich návštěvníky.', benefits: 'Plynulý provoz · chytrá automatizace', path: '/vyuziti/komercni', icon: Building2 },
  { title: 'Art instalace', text: 'Zakázkové mlžné skulptury jako zážitkový prvek pro kulturní a veřejný prostor.', benefits: 'Autorský návrh · scénické řízení', path: '/vyuziti/art-instalace', icon: Palette },
];

export default function Vyuziti() {
  useEffect(() => { setSEO({ title: 'Využití mlžítek | Mlzidla.cz', description: 'Mlžítka pro veřejné, komerční, pečovatelské a relaxační prostory.', canonicalPath: '/vyuziti' }); }, []);
  return <main className="min-h-screen bg-white"><section className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white lg:pb-28 lg:pt-36"><MistHeroBackground /><div className="site-container relative z-10"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#0070F3]">B2B využití</p><h1 className="max-w-3xl font-heading font-light">Mlha pro prostor, kde na pohodlí záleží.</h1><p className="mt-6 max-w-2xl text-lg text-white/65">Řešení pro veřejné prostranství, péči, pohostinství i relaxaci. Vyberte typ místa a objevte konkrétní přínosy pro jeho provoz.</p></div></section><section className="site-container py-14 lg:py-20"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{segments.map((segment) => <Link key={segment.path} to={segment.path} className="group flex min-h-64 flex-col border border-slate-200 p-6 transition-colors hover:border-slate-950 hover:bg-slate-950"><segment.icon size={23} className="mb-8 text-[#0070F3]" /><h2 className="m-0 text-xl font-medium text-slate-950 group-hover:text-white">{segment.title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600 group-hover:text-white/65">{segment.text}</p><p className="mt-auto pt-6 text-xs font-bold text-[#0070F3]">{segment.benefits}</p><ArrowRight size={16} className="mt-4 text-slate-400 group-hover:text-white" /></Link>)}</div></section><UsageSegmentSlider /></main>;
}