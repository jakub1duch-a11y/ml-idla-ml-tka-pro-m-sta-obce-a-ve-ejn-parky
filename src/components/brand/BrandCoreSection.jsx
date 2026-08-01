import React from 'react';
import { Hammer, Ruler, Landmark, BadgeCheck, HeartHandshake } from 'lucide-react';

const VALUES = [
  [Hammer,'Česká řemeslná kvalita','Vyrábíme sami, v Česku a z materiálů prověřených průmyslovou praxí.'],
  [Ruler,'Zakázková přesnost','Nasloucháme zadání a navrhujeme řešení přímo pro konkrétní místo.'],
  [Landmark,'Odpovědnost k prostoru','Každý prvek musí být bezpečný, funkční a v souladu s architekturou.'],
  [BadgeCheck,'Odbornost, která osvěžuje','Mluvíme jasně, věcně a bez zbytečného technického žargonu.'],
  [HeartHandshake,'Péče o výsledek','Náš zájem pokračuje instalací, servisem i dlouhodobým vztahem.']
];

export default function BrandCoreSection() {
  return <section id="jadro" className="scroll-mt-32 bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">01 · Brand jádro</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl">Co jsme, kam jdeme a čím se řídíme.</h2></div><blockquote className="border-l-2 border-accent pl-6 text-xl leading-relaxed text-foreground">Přinášíme 20 let průmyslové preciznosti do veřejného prostoru — navrhujeme a vyrábíme česká mlžítka, která vydrží generace.</blockquote></div>
    <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-5">{VALUES.map(([Icon,title,text], index) => <article key={title} className="bg-card p-6"><span className="font-mono text-xs text-secondary">0{index + 1}</span><Icon className="mt-8 text-secondary" size={22}/><h3 className="mt-5 text-lg">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
  </div></section>;
}