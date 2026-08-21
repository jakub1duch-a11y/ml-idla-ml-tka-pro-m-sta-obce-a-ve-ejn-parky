import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Leaf, ShieldCheck } from 'lucide-react';

const ROWS = [
  { label: 'Kotvení', permanent: 'Projektové kotvení podle podkladu', mobile: 'Zemní vrut nebo jiné sezónní řešení' },
  { label: 'Napojení vody', permanent: 'Přípojka podle hydraulického návrhu', mobile: 'Jednodušší napojení podle konkrétního modelu' },
  { label: 'Vedení', permanent: 'Skryté nebo integrované podle projektu', mobile: 'Důraz na rychlou montáž a demontáž' },
  { label: 'Typické použití', permanent: 'Náměstí, parky, promenády, veřejné areály', mobile: 'Zahrady, terasy a sezónní instalace' },
];

export default function InstallationComparisonSection() {
  return (
    <section className="border-t border-border bg-muted/35 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Instalace</p>
          <h2 className="mt-4 font-heading text-4xl tracking-[-.03em] text-foreground lg:text-5xl">Trvalé i sezónní řešení má vlastní logiku.</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">Kotvení, napojení a servisní přístup se nevolí jednou univerzální šablonou. Přizpůsobují se produktu, podkladu, provozu a požadované míře mobility.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border bg-card p-7 lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-secondary"><Building2 size={18} /></div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.16em] text-secondary">01 / Trvalé kotvení</p>
            <h3 className="mt-2 font-heading text-3xl">Veřejný a architektonický prostor</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Kotvení a přípojky se koordinují s projektem stavby, povrchy a servisním přístupem. Cílem je čistý detail a dlouhodobý provoz.</p>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="rounded-3xl border border-border bg-card p-7 lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-secondary"><Leaf size={18} /></div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.16em] text-secondary">02 / Sezónní instalace</p>
            <h3 className="mt-2 font-heading text-3xl">Zahrada, terasa a flexibilní provoz</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">U vybraných modelů lze použít rychlejší a přemístitelné kotvení. Přesný způsob závisí na konstrukci výrobku a podkladu.</p>
          </motion.article>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="hidden grid-cols-[.7fr_1fr_1fr] border-b border-border bg-muted/50 px-6 py-4 text-xs font-semibold text-muted-foreground sm:grid">
            <span>Parametr</span><span>Trvalá instalace</span><span>Sezónní / mobilní</span>
          </div>
          {ROWS.map((row) => (
            <div key={row.label} className="grid gap-3 border-b border-border px-6 py-5 last:border-0 sm:grid-cols-[.7fr_1fr_1fr] sm:items-center">
              <span className="font-mono text-[10px] uppercase tracking-[.12em] text-secondary">{row.label}</span>
              <span className="text-sm text-foreground">{row.permanent}</span>
              <span className="text-sm text-muted-foreground">{row.mobile}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-background p-6">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-secondary" />
          <div>
            <h3 className="font-heading text-xl text-foreground">Použití konstrukce a bezpečnost</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Mlžítko je navržené jako chladicí a architektonický prvek. Pokud má být výrobek současně používán jako herní, lezecký, sedací nebo jinak zatěžovaný prvek, musí se takové použití řešit samostatně v návrhu a posouzení konkrétního projektu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
