import React from 'react';
import { ArrowRight } from 'lucide-react';

const ADS = [
  ['Města','Veřejný prostor, který funguje i v horku.','Navrhneme bezpečný mlžný systém od prvního výkresu po instalaci.','Popsat projekt','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/da0942c09_mlzidla-mlzitka-pro-mesta-obce.png'],
  ['Hotely','Osvěžení, které se stane součástí architektury.','Česká nerezová výroba na míru prostoru i nárokům hostů.','Probrat záměr','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b94c771e1_a982a794f_mlzitkosteblo.jpg'],
  ['Eventy','Místo, ke kterému se lidé vracejí.','Mobilní mlžné instalace s dodáním, brandingem a servisem.','Zjistit možnosti','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/518c8c2a3_mlzitka-pro-mesta.jpg']
];

export default function BrandAdvertisingGuide() {
  return <section id="reklama" className="scroll-mt-32 bg-muted py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">04 · Reklamní návod</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl">Jedna struktura. Tři konkrétní kampaně.</h2><p className="mt-5 max-w-2xl text-muted-foreground">Každá reklama používá pořadí: jasný přínos → důkaz nebo způsob řešení → jediná výzva k akci.</p>
    <div className="mt-10 grid gap-5 lg:grid-cols-3">{ADS.map(([segment,title,text,cta,image]) => <article key={segment} className="overflow-hidden rounded-2xl bg-card shadow-sm"><div className="relative aspect-[4/5]"><img src={image} alt={`Reklamní náhled pro segment ${segment}`} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">MLŽIDLA® · {segment}</p><h3 className="mt-3 text-2xl">{title}</h3><p className="mt-3 text-sm text-primary-foreground/75">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">{cta}<ArrowRight size={14}/></span></div></div><div className="p-5 text-xs leading-relaxed text-muted-foreground">Formát 4:5 · Nadpis do 8 slov · Jedno sdělení · Jedno CTA</div></article>)}</div>
  </div></section>;
}