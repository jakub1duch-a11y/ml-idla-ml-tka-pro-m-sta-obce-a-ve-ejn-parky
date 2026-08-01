import React from 'react';

const FONTS = [
  { name: 'Manrope', role: 'Nadpisy a claimy', detail: 'Light 300 · Medium 500 · Semibold 600', sample: 'Prostor, který dýchá.', className: 'font-heading text-4xl font-light tracking-tight' },
  { name: 'Inter', role: 'Delší texty a rozhraní', detail: 'Regular 400 · Medium 500 · Semibold 600', sample: 'Mlžný systém navrhujeme jako přirozenou součást místa.', className: 'font-reading text-xl leading-relaxed' },
  { name: 'JetBrains Mono', role: 'Technická data a štítky', detail: 'Regular 400 · Medium 500', sample: 'TLAK 2–7 BAR · NEREZ AISI 304', className: 'font-mono text-sm tracking-[.12em]' }
];

export default function BrandTypographyGuide() {
  return <div className="mt-16"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Typografie</p><h3 className="mt-3 text-3xl">Tři písma. Tři jasné úlohy.</h3><p className="mt-3 text-muted-foreground">Hierarchie stojí na lehkých nadpisech, čitelném textu a přesném technickém detailu.</p></div>
    <div className="mt-7 grid gap-4 lg:grid-cols-3">{FONTS.map(font => <article key={font.name} className="rounded-2xl border border-border bg-card p-6"><div className="flex items-start justify-between gap-4"><div><h4 className="text-xl">{font.name}</h4><p className="mt-1 text-sm text-secondary">{font.role}</p></div><span className="font-mono text-4xl text-muted-foreground/35">Aa</span></div><p className={`mt-10 text-foreground ${font.className}`}>{font.sample}</p><p className="mt-8 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">{font.detail}</p></article>)}</div>
    <div className="mt-4 rounded-2xl border border-border bg-ink p-7 text-white"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Ukázka hierarchie</p><p className="mt-5 font-heading text-4xl font-light">Ochlazení navržené pro město.</p><p className="mt-3 max-w-2xl font-reading text-sm leading-relaxed text-white/70">Nadpis sděluje hlavní přínos. Doprovodný text věcně vysvětluje řešení a technický řádek přidává důkaz.</p><p className="mt-6 font-mono text-xs tracking-[.12em] text-cyan">ČESKÁ VÝROBA · NEREZ · NÍZKÝ TLAK</p></div>
  </div>;
}