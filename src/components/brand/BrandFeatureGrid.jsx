import React from 'react';

export default function BrandFeatureGrid({ items }) {
  return <div className="grid gap-px bg-[#b9c3c8] border border-[#b9c3c8] md:grid-cols-2">
    {items.map(({ icon: Icon, title, text, code }) => <article key={title} className="bg-background p-7 lg:p-9">
      <div className="flex items-start justify-between gap-4"><Icon size={22} strokeWidth={1.5} className="text-secondary" /><span className="font-mono text-[10px] tracking-[.16em] text-muted-foreground">{code}</span></div>
      <h3 className="mt-12 font-heading text-2xl text-foreground">{title}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{text}</p>
    </article>)}
  </div>;
}