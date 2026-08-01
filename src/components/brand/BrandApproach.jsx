import React from 'react';

const STEPS = ['Čteme místo', 'Navrhujeme řešení', 'Vyrábíme přesně', 'Pečujeme dlouhodobě'];

export default function BrandApproach() {
  return <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Náš přístup</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl text-foreground">Zakázková výroba není komplikace. Je to naše výhoda.</h2></div><div><p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">Nasloucháme potřebám měst, architektů i investorů a navrhujeme řešení přímo pro jejich projekt. Jasně, odborně a s odpovědností za výsledek.</p><ol className="mt-12 grid gap-5 sm:grid-cols-2">{STEPS.map((step, index) => <li key={step} className="border-t border-border pt-4"><span className="font-mono text-xs text-secondary">0{index + 1}</span><p className="mt-5 font-heading text-xl text-foreground">{step}</p></li>)}</ol></div></div></section>;
}