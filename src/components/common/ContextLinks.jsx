import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ContextLinks({ eyebrow = 'Související obsah', title = 'Pokračujte podle toho, co právě řešíte.', items = [] }) {
  if (!items.length) return null;
  return (
    <section className="border-y border-border bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl">{title}</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.path} to={item.path} className="group flex min-h-[180px] flex-col justify-between rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-secondary/40 hover:shadow-lg">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-secondary">{item.kicker}</p>
                <h3 className="mt-3 font-heading text-2xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">{item.cta || 'Zjistit více'} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}