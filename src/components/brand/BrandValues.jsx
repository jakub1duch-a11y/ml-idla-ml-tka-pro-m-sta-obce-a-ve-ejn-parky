import React from 'react';
import { Compass, Droplets, Leaf } from 'lucide-react';

const VALUES = [
  { icon: Compass, title: 'Architektura s důvodem', text: 'Každý prvek začíná prostorem, jeho lidmi a tím, jak se v něm má žít.' },
  { icon: Droplets, title: 'Technologie v rovnováze', text: 'Jemná mlha ochlazuje vzduch přirozeným odparem – bez vizuálního i provozního přetlaku.' },
  { icon: Leaf, title: 'Dlouhodobá odpovědnost', text: 'Nerezová ocel, modulární konstrukce a servisovatelný návrh dávají řešením dlouhou životnost.' }
];

export default function BrandValues() {
  return <section className="bg-primary text-primary-foreground"><div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28"><div className="max-w-2xl"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Naše hodnoty</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl">Kvalita, která je cítit. Ne vidět.</h2></div><div className="mt-14 grid gap-8 md:grid-cols-3">{VALUES.map(({ icon: Icon, title, text }, index) => <article key={title} className="border-t border-white/20 pt-6"><p className="font-mono text-xs text-accent">0{index + 1}</p><Icon className="mt-8 text-accent" size={22}/><h3 className="mt-5 font-heading text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/70">{text}</p></article>)}</div></div></section>;
}