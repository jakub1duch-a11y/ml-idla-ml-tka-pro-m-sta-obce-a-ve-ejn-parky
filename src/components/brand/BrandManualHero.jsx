import React from 'react';
import { Download, Printer } from 'lucide-react';

export default function BrandManualHero() {
  const printManual = () => window.print();
  return <section className="relative overflow-hidden bg-primary text-primary-foreground">
    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--accent))_0,transparent_28%),linear-gradient(120deg,transparent_38%,rgba(255,255,255,.08)_38.2%,transparent_38.5%)]" />
    <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
      <p className="font-mono text-[11px] uppercase tracking-[.2em] text-accent">MLŽIDLA® · Brand manuál 2026</p>
      <h1 className="mt-5 max-w-5xl font-heading text-5xl lg:text-7xl">Značka, která tvoří s přesností a pečuje o výsledek.</h1>
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-primary-foreground/75">Praktický systém pro jednotnou komunikaci, reklamu a prezentaci českých mlžítek ve veřejném prostoru.</p>
      <div className="brand-no-print mt-9 flex flex-wrap gap-3">
        <button onClick={printManual} className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"><Download size={16}/> Uložit jako PDF</button>
        <button onClick={printManual} className="inline-flex items-center gap-2 border border-primary-foreground/35 px-5 py-3 text-sm font-semibold"><Printer size={16}/> Tisková verze</button>
      </div>
      <p className="brand-no-print mt-3 text-xs text-primary-foreground/55">V tiskovém dialogu zvolte „Uložit jako PDF“ nebo tiskárnu.</p>
    </div>
  </section>;
}