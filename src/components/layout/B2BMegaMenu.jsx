import React from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  ['Distributoři a prodejci', '/partnerstvi/distributori'], ['Architekti a projektanti', '/partnerstvi/architekti'], ['Montážní a servisní firmy', '/partnerstvi/montazni'], ['Města a veřejný sektor', '/partnerstvi/verejny-sektor'],
];

export default function B2BMegaMenu() {
  return <div className="absolute right-0 top-full w-80 border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl shadow-slate-950/20"><p className="px-3 py-2 text-xs font-bold uppercase tracking-[.16em] text-[#0070F3]">Partnerské programy</p>{LINKS.map(([label, to]) => <Link key={to} to={to} className="block px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50 hover:text-[#0070F3]">{label}</Link>)}<Link to="/partnerstvi" className="mt-2 block border-t border-slate-100 px-3 pt-3 text-sm font-bold text-slate-900 hover:text-[#0070F3]">Přehled partnerství →</Link></div>;
}