import React from 'react';
import { Check, X } from 'lucide-react';

const YES = ['Navrhneme řešení přímo pro váš projekt — stačí popsat záměr.','Mlžný systém realizujeme od návrhu po instalaci.','Získáte partnera s 20 lety výrobní zkušenosti.'];
const NO = ['Máme super mlžítka, podívejte se na náš e-shop!','Ceny jsou fakt výhodné, určitě se vám to vyplatí.','Děláme mlžení pro každého a úplně kamkoliv.'];

export default function BrandVoiceSection() {
  return <section id="hlas" className="scroll-mt-32 bg-primary py-20 text-primary-foreground lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <div className="grid gap-10 lg:grid-cols-2"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">02 · Hlas značky</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl">Jistý. Odborný. Osvěžující.</h2><p className="mt-5 max-w-xl text-primary-foreground/70">Mluvíme jako zkušený partner: klidně, přímo a s konkrétním řešením. Tvůrce přináší vizi, Pečovatel jistotu a lidský rozměr.</p></div><div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-7"><p className="font-mono text-xs uppercase tracking-widest text-accent">Archetyp 60 / 40</p><p className="mt-3 text-2xl font-heading">Tvůrce + Pečovatel</p><p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">Každý projekt je příležitost nechat něco lepšího, než jsme našli.</p></div></div>
    <div className="mt-12 grid gap-5 md:grid-cols-2"><div className="rounded-2xl bg-card p-7 text-card-foreground"><h3 className="flex items-center gap-2 text-xl"><Check className="text-secondary"/> Říkáme tak</h3>{YES.map(text => <p key={text} className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">{text}</p>)}</div><div className="rounded-2xl border border-primary-foreground/15 p-7"><h3 className="flex items-center gap-2 text-xl"><X className="text-accent"/> Neříkáme tak</h3>{NO.map(text => <p key={text} className="mt-4 border-t border-primary-foreground/15 pt-4 text-sm text-primary-foreground/65">{text}</p>)}</div></div>
  </div></section>;
}