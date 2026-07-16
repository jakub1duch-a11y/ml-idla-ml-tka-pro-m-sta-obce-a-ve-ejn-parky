import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import MistHeroBackground from '@/components/common/MistHeroBackground';

const segments = [
  { title: 'Města a obce', text: 'Chladnější veřejný prostor.', path: '/vyuziti/mesta-obce', icon: Building2 },
  { title: 'Parky a hřiště', text: 'Bezpečná letní osvěžení.', path: '/vyuziti/parky-hriste', icon: Trees },
  { title: 'Koupaliště a aquaparky', text: 'Komfort kolem vody.', path: '/vyuziti/koupaliste', icon: Waves },
  { title: 'Pro architekty', text: 'Mlha jako materiál návrhu.', path: '/vyuziti/architekti', icon: Palette },
  { title: 'Komerční prostory', text: 'Pohodlí, které podporuje provoz.', path: '/vyuziti/komercni', icon: Factory },
  { title: 'Eventy a festivaly', text: 'Osvěžení, na které se vzpomíná.', path: '/vyuziti/eventy', icon: Tent },
  { title: 'Outdoor a zahrady', text: 'Chladivá oáza venku.', path: '/vyuziti/outdoor-zahrady', icon: Flower2 },
  { title: 'Art instalace', text: 'Zakázkové mlžné skulptury.', path: '/vyuziti/art-instalace', icon: Sparkles },
  { title: 'Školy, školky a děti', text: 'Jemné a bezpečné ochlazení.', path: '/vyuziti/skoly-skolky-deti', icon: Baby },
];
export default function Vyuziti() { React.useEffect(() => { setSEO({ title: 'Využití mlžítek | mlzidla.cz', description: 'Mlžítka pro veřejné, komerční i soukromé prostory.' }); }, []); return <main className="min-h-screen bg-white"><section className="relative overflow-hidden bg-slate-950 text-white pt-28 pb-20 lg:pt-36 lg:pb-28"><MistHeroBackground /><div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10"><p className="text-xs font-mono tracking-[.22em] uppercase text-cyan mb-4">B2B využití</p><h1 className="font-heading font-light text-4xl lg:text-6xl max-w-3xl">Mlha pro prostor, kde na pohodlí záleží.</h1><p className="mt-6 max-w-2xl text-white/65 text-lg">Vyberte typ místa a objevte řešení navržené pro jeho provoz, návštěvníky i atmosféru.</p></div></section><section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{segments.map((segment) => <Link key={segment.path} to={segment.path} className="group min-h-48 border border-slate-200 p-6 flex flex-col hover:bg-slate-950 hover:border-slate-950 transition-colors"><segment.icon size={23} className="text-sky-500 mb-auto"/><h2 className="font-heading text-xl font-medium text-slate-950 group-hover:text-white mt-9 mb-2">{segment.title}</h2><div className="flex items-center justify-between gap-4"><p className="text-sm text-slate-500 group-hover:text-white/60">{segment.text}</p><ArrowRight size={16} className="text-slate-400 group-hover:text-cyan shrink-0"/></div></Link>)}</div></section></main>; }