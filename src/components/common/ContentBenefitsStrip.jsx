import React from 'react';

export default function ContentBenefitsStrip({ title, items }) {
  return (
    <section className="my-12 border-y border-slate-200 bg-slate-50 py-10">
      <p className="content-eyebrow">Rychlý přehled</p>
      <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight text-slate-950">{title}</h2>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, title: itemTitle, text }) => (
          <article key={itemTitle} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-techblue"><Icon size={20} strokeWidth={1.6} /></span>
            <div><h3 className="m-0 text-sm font-semibold text-slate-950">{itemTitle}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}