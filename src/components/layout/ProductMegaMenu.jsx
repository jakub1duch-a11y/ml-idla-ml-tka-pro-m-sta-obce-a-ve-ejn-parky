import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarDays, Home, Palmtree, Store, Trees } from 'lucide-react';

const CATEGORIES = [
  { label: 'Pro města a obce', text: 'Náměstí, zastávky a veřejný prostor.', to: '/vyuziti/mesta-obce', icon: Building2 },
  { label: 'Parky a hřiště', text: 'Bezpečné ochlazení pro rodiny.', to: '/vyuziti/parky-hriste', icon: Trees },
  { label: 'Gastro a komerční', text: 'Terasy, hotely a provozovny.', to: '/vyuziti/komercni', icon: Store },
  { label: 'Eventy a festivaly', text: 'Mobilní osvěžení pro davy.', to: '/vyuziti/eventy', icon: CalendarDays },
  { label: 'Zahrady a rezidence', text: 'Pohodlí doma i na terase.', to: '/vyuziti/outdoor-zahrady', icon: Home },
  { label: 'Koupaliště a aquaparky', text: 'Chladivé zóny u vody.', to: '/vyuziti/koupaliste', icon: Palmtree },
];

export default function ProductMegaMenu() {
  return <div className="absolute left-0 top-full w-[760px] rounded-b-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/20">
    <div className="mb-5 flex items-end justify-between border-b border-slate-100 pb-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Vyberte podle prostoru</p><p className="mt-1 text-sm text-slate-500">Najděte řešení podle typu projektu.</p></div>
      <Link to="/katalog" className="text-sm font-bold text-slate-900 hover:text-sky-600">Celý katalog →</Link>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.map(({ label, text, to, icon: Icon }) => <Link key={to} to={to} className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50">
        <Icon size={18} className="mt-0.5 shrink-0 text-sky-600" />
        <span><b className="block text-sm">{label}</b><small className="mt-0.5 block text-xs leading-relaxed text-slate-500">{text}</small></span>
      </Link>)}
    </div>
  </div>;
}