import React from 'react';
import BrandColorPalette from '@/components/brand/BrandColorPalette';
import BrandTypographyGuide from '@/components/brand/BrandTypographyGuide';
import BrandLogoGuide from '@/components/brand/BrandLogoGuide';

export default function BrandVisualSystem() {
  return <section id="vizual" className="scroll-mt-32 bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">03 · Vizuální systém</p><h2 className="mt-4 max-w-3xl font-heading text-4xl lg:text-5xl">Technická přesnost s lehkostí mlhy.</h2>
    <BrandColorPalette/>
    <BrandTypographyGuide/>
    <BrandLogoGuide/>
    <article className="mt-16 rounded-2xl border border-border bg-card p-7"><p className="font-mono text-xs uppercase tracking-[.16em] text-secondary">Obrazový styl</p><h3 className="mt-3 text-2xl">Skutečný prostor, materiál a lidé.</h3><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">Fotografie zachycují nerez, viditelnou jemnou mlhu a přirozené světlo. Upřednostňujeme reálné instalace bez umělých filtrů a laciných efektů.</p></article>
  </div></section>;
}