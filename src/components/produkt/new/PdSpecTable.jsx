import React from 'react';

export default function PdSpecTable({ title, rows, icon: Icon }) {
  if (!rows.length) return null;
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border p-5 sm:p-6">
        <Icon size={21} strokeWidth={1.5} className="shrink-0 text-primary" aria-hidden="true" />
        <h3 className="font-heading text-xl text-card-foreground">{title}</h3>
      </div>
      <dl className="divide-y divide-border">
        {rows.map(({ label, value }) => (
          <div key={label} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1.2fr] sm:gap-5 sm:px-6">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="min-w-0 break-words font-mono text-sm font-medium text-card-foreground sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}