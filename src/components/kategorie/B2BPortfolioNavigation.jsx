import React from 'react';
import { Link } from 'react-router-dom';

const PORTFOLIO = [
  ['Města a obce', '/kategorie/mesta-obce'], ['Parky a hřiště', '/kategorie/parky-hriste'], ['Koupaliště & aquaparky', '/kategorie/koupaliste'], ['Outdoor a zahrady', '/kategorie/outdoor-zahrady'], ['Art instalace na míru', '/kategorie/art-instalace'], ['Školy a školky', '/kategorie/skoly-skolky-deti'], ['Pro architekty', '/kategorie/architekti'], ['Komerční prostory', '/kategorie/komercni'], ['Eventy & festivaly', '/kategorie/eventy']
];

export default function B2BPortfolioNavigation({ current }) {
  return <section className="border-t border-slate-200 bg-slate-50"><div className="max-w-7xl mx-auto px-6 lg:px-10 py-12"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Řešení podle využití</p><h2 className="mt-2 font-heading text-3xl text-foreground">Prozkoumejte další oblasti.</h2></div><Link to="/mlzidla-mlzitka" className="text-sm font-semibold text-foreground">Celý katalog →</Link></div><nav className="mt-7 flex flex-wrap gap-2">{PORTFOLIO.map(([label, path]) => <Link key={path} to={path} className={`rounded-full border px-4 py-2 text-sm transition-colors ${label === current ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-slate-300 bg-white text-slate-700 hover:border-secondary hover:text-secondary'}`}>{label}</Link>)}</nav></div></section>;
}