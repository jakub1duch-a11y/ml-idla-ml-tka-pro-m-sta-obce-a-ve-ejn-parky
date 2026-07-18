import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Cable, CalendarDays, Home, Landmark, Palmtree, Store, TentTree, Trees } from 'lucide-react';

const CATEGORIES = [
  { label: 'Pro města a obce', text: 'Náměstí, zastávky a veřejný prostor.', to: '/vyuziti/mesta-obce', icon: Building2 },
  { label: 'Parky a hřiště', text: 'Bezpečné ochlazení pro rodiny.', to: '/vyuziti/parky-hriste', icon: Trees },
  { label: 'Gastro a komerční', text: 'Terasy, hotely a provozovny.', to: '/vyuziti/komercni', icon: Store },
  { label: 'Eventy a festivaly', text: 'Mobilní osvěžení pro davy.', to: '/vyuziti/eventy', icon: CalendarDays },
  { label: 'Zahrady a rezidence', text: 'Pohodlí doma i na terase.', to: '/vyuziti/outdoor-zahrady', icon: Home },
  { label: 'Koupaliště a aquaparky', text: 'Chladivé zóny u vody.', to: '/vyuziti/koupaliste', icon: Palmtree },
];

const SOLUTIONS = [
  { label: 'Designová architektonická mlžítka', text: 'Mlžné stromy, stébla a monolity.', to: '/reseni/designova', icon: Landmark },
  { label: 'Vstupní a uvítací mlžné brány', text: 'Definují vstup do areálu.', to: '/reseni/brany', icon: Building2 },
  { label: 'Chytré moduly a příslušenství', text: 'Řízení, ventily a příslušenství.', to: '/reseni/chytre-moduly', icon: Cable },
  { label: 'Mobilní eventová mlžítka', text: 'Sezónní instalace a pronájem.', to: '/reseni/mobilni-eventove', icon: TentTree },
];

function MenuLink({ label, text, to, icon: Icon }) {
  return <Link to={to} className="group flex items-start gap-3 p-3 transition hover:bg-slate-50"><Icon size={18} className="mt-0.5 shrink-0 text-[#0070F3]" /><span><b className="block text-sm">{label}</b><small className="mt-0.5 block text-xs leading-relaxed text-slate-500">{text}</small></span></Link>;
}

export default function ProductMegaMenu() {
  return <div className="absolute left-0 top-full w-[920px] rounded-b-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/20"><div className="flex items-end justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0070F3]">Produkty a řešení</p><p className="mt-1 text-sm text-slate-500">Řešení podle typu prostoru i provozu.</p></div><Link to="/katalog" className="text-sm font-bold text-slate-900 hover:text-[#0070F3]">Celý katalog →</Link></div><div className="grid grid-cols-2 gap-x-6"><div className="pt-5"><p className="px-3 text-xs font-bold uppercase tracking-[.14em] text-slate-400">Podle prostoru</p><div className="mt-2 grid grid-cols-2 gap-1">{CATEGORIES.map((item) => <MenuLink key={item.to} {...item} />)}</div></div><div className="border-l border-slate-100 pt-5 pl-6"><p className="px-3 text-xs font-bold uppercase tracking-[.14em] text-slate-400">Konstrukce a technologie</p><div className="mt-2">{SOLUTIONS.map((item) => <MenuLink key={item.to} {...item} />)}</div></div></div></div>;
}