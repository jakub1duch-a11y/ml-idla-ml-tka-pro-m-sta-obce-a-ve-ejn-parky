import React from 'react';
import { ArrowRight } from 'lucide-react';

const ADS = [
  ['Města a obce','Ochlazení náměstí, promenád, parků a vstupů veřejné správy.','Navrhneme bezpečné městské mlžítko podle pohybu lidí, charakteru prostranství a provozních podmínek.','Řešit veřejný prostor','/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp'],
  ['Gastro, wellness a hotely','Více komfortu na terasách a v hotelových zahradách.','Jemná mlha prodlouží využití venkovního prostoru a nerezové provedení přirozeně naváže na architekturu provozu.','Navrhnout terasu','/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp'],
  ['Rezidence a zahrady','Mlžítko navržené pro konkrétní zahradu nebo terasu.','Přizpůsobíme tvar, rozměr i kotvení rezidenčnímu prostoru — od samostatného prvku po řešení integrované do zahrady.','Popsat vlastní záměr','/media/optimized/68953132b_IMG_3524.webp']
];

export default function BrandAdvertisingGuide() {
  return <section id="reklama" className="scroll-mt-32 bg-muted py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">04 · Reklamní návod</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl">Města, hospitality a rezidenční prostor.</h2><p className="mt-5 max-w-2xl text-muted-foreground">Komunikace vždy začíná konkrétním místem: městské prostranství, provoz pro hosty nebo soukromá zahrada. Poté ukáže přínos a jedinou výzvu k akci.</p>
    <div className="mt-10 grid gap-5 lg:grid-cols-3">{ADS.map(([segment,title,text,cta,image]) => <article key={segment} className="overflow-hidden rounded-2xl bg-card shadow-sm"><div className="relative aspect-[4/5]"><img src={image} alt={`Reklamní náhled pro segment ${segment}`} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">MLŽIDLA® · {segment}</p><h3 className="mt-3 text-2xl">{title}</h3><p className="mt-3 text-sm text-primary-foreground/75">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">{cta}<ArrowRight size={14}/></span></div></div><div className="p-5 text-xs leading-relaxed text-muted-foreground">Formát 4:5 · Nadpis do 8 slov · Jedno sdělení · Jedno CTA</div></article>)}</div>
  </div></section>;
}