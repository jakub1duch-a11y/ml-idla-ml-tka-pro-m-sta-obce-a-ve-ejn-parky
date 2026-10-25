import React from 'react';

const FONTS = [
  { name: 'Space Grotesk', role: 'Hlavní nadpisy, titulky a značková tlačítka', detail: '600–700 · geometrický charakter · řádkování 1,1 · prostrkání −0,01 em', sample: 'Ochlazení, které patří k architektuře.', className: 'font-heading text-4xl font-semibold' },
  { name: 'Albert Sans', role: 'Odstavce, navigace, formuláře a popisky', detail: '400–600 · běžný text 16–18 px · řádkování 1,55 · česká diakritika', sample: 'Mlžný systém navrhujeme jako přirozenou součást konkrétního místa.', className: 'font-body text-xl' }
];

export default function BrandTypographyGuide() {
  return <div className="mt-16"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Typografie</p><h3 className="mt-3 text-3xl">Dvě písma. Jedna jasná identita.</h3><p className="mt-3 text-muted-foreground">Space Grotesk navazuje geometrickým charakterem na oblouk a kapku v logu. Albert Sans zajišťuje klidné čtení odstavců i přehledné ovládání. Logotyp zůstává beze změny; JetBrains Mono je vyhrazen technickým údajům.</p></div>
    <div className="mt-7 grid gap-4 lg:grid-cols-2">{FONTS.map(font => <article key={font.name} className="rounded-2xl border border-border bg-card p-6"><div className="flex items-start justify-between gap-4"><div><h4 className="text-xl">{font.name}</h4><p className="mt-1 text-sm text-secondary">{font.role}</p></div><span className="font-mono text-4xl text-muted-foreground/35">Aa</span></div><p className={`mt-10 text-foreground ${font.className}`}>{font.sample}</p><p className="mt-8 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">{font.detail}</p></article>)}</div>
    <div className="mt-4 rounded-2xl border border-border bg-ink p-7 text-white"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Ukázka hierarchie</p><p className="mt-5 font-heading text-4xl font-semibold">Ochlazení navržené pro město.</p><p className="mt-3 max-w-2xl font-reading text-sm leading-relaxed text-white/70">Nadpis sděluje hlavní přínos. Doprovodný text věcně vysvětluje řešení a technický řádek přidává důkaz.</p><p className="mt-6 font-mono text-xs tracking-[.12em] text-cyan">ČESKÁ VÝROBA · NEREZ · NÍZKÝ TLAK</p></div>
  </div>;
}