import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const GROUPS = [
  { title: 'Produkty a kolekce', links: [
    ['Všechny produkty', '/mlzidla-mlzitka'], ['Městská mlžítka', '/mestske-mlzitka'],
    ['Zahradní mlžítka', '/zahradni-mlzitka'], ['Zakázková mlžítka', '/zakazkova-mlzitka'],
  ]},
  { title: 'Řešení podle využití', links: [
    ['Města a obce', '/kategorie/mesta-obce'], ['Parky a hřiště', '/kategorie/parky-hriste'],
    ['Koupaliště', '/kategorie/koupaliste'], ['Outdoor a zahrady', '/kategorie/outdoor-zahrady'],
    ['Architekti', '/kategorie/architekti'], ['Komerční prostory', '/kategorie/komercni'],
    ['Eventy', '/kategorie/eventy'], ['Art instalace', '/kategorie/art-instalace'],
  ]},
];

export default function ArticleLinkMap() {
  return <nav className="grid gap-7 bg-slate-50 px-5 py-8 sm:grid-cols-2 sm:px-7" aria-label="Mapa souvisejících odkazů">
    {GROUPS.map((group) => <div key={group.title}><h2 className="mb-3 font-heading text-lg font-medium text-slate-900">{group.title}</h2><div className="flex flex-wrap gap-2">{group.links.map(([label, path]) => <Link key={path} to={path} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900">{label}<ArrowUpRight size={13} /></Link>)}</div></div>)}
  </nav>;
}