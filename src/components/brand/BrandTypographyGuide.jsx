import React from 'react';

const FONTS = [
  { name: 'Bricolage Grotesque', role: 'Emoční hero a výrazné nadpisy', detail: 'Proměnná váha 600–750 · těsnější proklad a optická hierarchie', sample: 'Ochlazení, které patří k architektuře.', className: 'text-4xl font-bold tracking-tight [font-family:var(--mlz-font-display)]' },
  { name: 'Manrope', role: 'Navigace, CTA a technické UI', detail: 'Váha 500–700 · jasné názvy, parametry a ovládací prvky', sample: 'Přesné řešení pro město i zahradu.', className: 'text-2xl font-semibold [font-family:var(--mlz-font-ui)]' },
  { name: 'Inter', role: 'Dlouhé texty a informační obsah', detail: 'Regular 400–600 · čitelnost v odstavcích, návodech a tabulkách', sample: 'Mlžný systém navrhujeme jako přirozenou součást konkrétního místa.', className: 'font-reading text-xl leading-relaxed' }
];

export default function BrandTypographyGuide() {
  return <div className="mt-16"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Typografie</p><h3 className="mt-3 text-3xl">Emoce, technologie a čitelnost.</h3><p className="mt-3 text-muted-foreground">Bricolage Grotesque vytváří zapamatovatelný první dojem, Manrope vede rozhraní a technické informace, Inter drží delší texty klidné a snadno čitelné.</p></div>
    <div className="mt-7 grid gap-4 lg:grid-cols-2">{FONTS.map(font => <article key={font.name} className="rounded-2xl border border-border bg-card p-6"><div className="flex items-start justify-between gap-4"><div><h4 className="text-xl">{font.name}</h4><p className="mt-1 text-sm text-secondary">{font.role}</p></div><span className="font-mono text-4xl text-muted-foreground/35">Aa</span></div><p className={`mt-10 text-foreground ${font.className}`}>{font.sample}</p><p className="mt-8 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">{font.detail}</p></article>)}</div>
    <div className="mt-4 rounded-2xl border border-border bg-ink p-7 text-white"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Ukázka hierarchie</p><p className="mt-5 font-heading text-4xl font-light">Ochlazení navržené pro město.</p><p className="mt-3 max-w-2xl font-reading text-sm leading-relaxed text-white/70">Nadpis sděluje hlavní přínos. Doprovodný text věcně vysvětluje řešení a technický řádek přidává důkaz.</p><p className="mt-6 font-mono text-xs tracking-[.12em] text-cyan">ČESKÁ VÝROBA · NEREZ · NÍZKÝ TLAK</p></div>
  </div>;
}