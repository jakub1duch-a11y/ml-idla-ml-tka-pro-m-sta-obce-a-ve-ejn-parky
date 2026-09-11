import React from 'react';
import { motion } from 'framer-motion';
import { Circle, Square } from 'lucide-react';

const ICONS = { round: Circle, square: Square };

export default function ProductVariantsSection({ variants, eyebrow = 'Varianty profilu', title = 'Kulatá trubka nebo hranatý jekl.' }) {
  if (!variants?.length) return null;
  return (
    <section className="border-y border-border bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">{eyebrow}</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Oba profily mají shodnou technologii mlžení a maximální rozměr 70 mm. Vyberte tvar podle charakteru místa.</p>
        </motion.div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {variants.map((variant, index) => {
            const Icon = ICONS[variant.key] || Circle;
            return (
              <motion.article key={variant.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="grid overflow-hidden border border-border bg-background sm:grid-cols-[0.9fr_1.1fr]">
                <div className="aspect-[4/5] overflow-hidden bg-muted sm:aspect-auto sm:h-full">
                  <img src={variant.image} alt={variant.alt} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-col p-7">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary"><Icon size={18} /></span>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[.16em] text-secondary">{variant.profile}</p>
                  <h3 className="mt-1 font-heading text-2xl text-foreground">{variant.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{variant.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {variant.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-sm text-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />{point}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}