import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SystemComponentCard({ item }) {
  const Icon = item.icon;
  return <article className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl"><div className="relative border-b border-slate-100 bg-slate-950 p-5 text-white"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan">{item.kicker}</span><Icon size={30} className="mt-5 text-cyan transition-transform duration-300 group-hover:scale-110" /><h3 className="mt-4 text-xl font-semibold">{item.title}</h3></div><div className="flex flex-1 flex-col p-5"><p className="text-sm leading-relaxed text-slate-600">{item.desc}</p><dl className="mt-5 grid grid-cols-2 gap-2">{item.metrics.map(([label, value]) => <div key={label} className="bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 text-xs font-semibold text-slate-900">{value}</dd></div>)}</dl><Link to={item.to} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">Detail a možnosti <ArrowRight size={14} className="text-cyan-600 transition-transform group-hover:translate-x-1" /></Link></div></article>;
}