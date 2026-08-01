import React from 'react';

const COLORS = [['#0A1628','Navy Core','60 %'],['#1A85B0','Clear Blue','25 %'],['#2BBFCF','Fresh Cyan','10 %'],['#F7F9FB','White Space','5 %']];
const RULES = [['Logo','Používejte na klidném, kontrastním pozadí. Ochranná zóna odpovídá výšce symbolu kapky.'],['Minimum','Doporučená minimální šířka je 120 px na obrazovce a 30 mm v tisku.'],['Fotografie','Reálný prostor, nerez, lidé a viditelná jemná mlha. Přirozené světlo, žádné laciné efekty.'],['Typografie','Manrope pro titulky, Inter pro delší texty a JetBrains Mono pro technická data.']];

export default function BrandVisualSystem() {
  return <section id="vizual" className="scroll-mt-32 bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">03 · Vizuální systém</p><h2 className="mt-4 max-w-3xl font-heading text-4xl lg:text-5xl">Technická přesnost s lehkostí mlhy.</h2>
    <div className="mt-10 grid overflow-hidden rounded-2xl border border-border sm:grid-cols-2 lg:grid-cols-4">{COLORS.map(([color,name,ratio]) => <div key={name} className="bg-card"><div className="h-28" style={{backgroundColor: color}}/><div className="p-4"><p className="font-semibold">{name}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{color} · {ratio}</p></div></div>)}</div>
    <div className="mt-10 grid gap-4 md:grid-cols-2">{RULES.map(([title,text]) => <article key={title} className="rounded-xl border border-border bg-card p-6"><h3 className="text-xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
    <div className="mt-10 flex min-h-48 items-center justify-center rounded-2xl bg-muted p-10"><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png" alt="Logo MLŽIDLA v doporučené ochranné zóně" className="max-h-24 max-w-full object-contain"/></div>
  </div></section>;
}