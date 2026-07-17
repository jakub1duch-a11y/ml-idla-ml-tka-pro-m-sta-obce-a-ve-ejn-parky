import React from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  ['Jak funguje mlžení', '/jak-funguje-mlzeni'],
  ['Produkty', '/katalog'],
  ['Realizace', '/reference'],
  ['Využití', '/vyuziti'],
  ['Přínosy', '/prinosy-mlzitek'],
  ['Navrhnout řešení', '/poptavka'],
];

export default function HomeSectionNav() {
  return <nav id="navigace-uvod" aria-label="Rychlá navigace" className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10 [&::-webkit-scrollbar]:hidden">{LINKS.map(([label, path], index) => <Link key={path} to={path} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${index === LINKS.length - 1 ? 'bg-slate-950 text-white hover:bg-cyan hover:text-slate-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>{label}</Link>)}</div></nav>;
}