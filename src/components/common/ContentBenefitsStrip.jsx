import React from 'react';

export default function ContentBenefitsStrip({ title, items }) {
  return <section className="my-10 border-y border-slate-200 bg-slate-50 py-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0070F3]">Rychlý přehled</p><h2 className="mt-2 text-2xl font-medium text-slate-950">{title}</h2><div className="mt-6 grid gap-5 sm:grid-cols-3">{items.map(({ icon: Icon, title: itemTitle, text }) => <article key={itemTitle} className="flex gap-3"><Icon size={25} strokeWidth={1.5} className="shrink-0 text-[#0070F3]" /><div><h3 className="m-0 text-sm font-semibold text-slate-950">{itemTitle}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p></div></article>)}</div></section>;
}