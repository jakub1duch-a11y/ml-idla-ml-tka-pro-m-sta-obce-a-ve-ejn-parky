import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LINEA_VISUALS } from '@/components/produkt/productVisuals';

const SPECS = [['Profil', 'Ø 60–70 mm / 70×70 mm'], ['Materiál', 'Nerez AISI 316L'], ['Výška', '2,4–3,0 m dle projektu'], ['Tlak', '3–7 bar, bez čerpadla']];

export default function LineaHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 lg:pt-32 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Městská kolekce · LINEA</p>
          <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">Mlžítko LINEA. Přímá linka, která chladí.</h1>
          <p className="text-measure mt-5 text-lg leading-relaxed text-muted-foreground">Minimalistický nerezový sloup do Ø70 mm pro náměstí, promenády a moderní plazy. Kulatá trubka nebo hranatý jekl — podle charakteru vašeho místa.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground">Poptat LINEA <ArrowRight size={16} /></Link>
            <Link to="/produkt/linea-mlzitko" className="inline-flex min-h-12 items-center justify-center border border-border px-7 py-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">Technický list</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {SPECS.map(([label, value]) => (
              <div key={label} className="bg-card p-4">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</p>
                <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }}>
          <img src={LINEA_VISUALS.hero.url} alt={LINEA_VISUALS.hero.alt} className="h-[300px] w-full object-cover shadow-[0_12px_32px_rgba(10,22,40,0.12)] sm:h-[420px] lg:h-[540px]" loading="eager" />
        </motion.div>
      </div>
    </section>
  );
}