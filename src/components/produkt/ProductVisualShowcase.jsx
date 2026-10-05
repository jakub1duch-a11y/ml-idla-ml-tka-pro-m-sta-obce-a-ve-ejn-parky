import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Users, Wrench, ThermometerSnowflake } from 'lucide-react';
import { getProductVisuals } from '@/components/produkt/productVisuals';

const ICONS = { droplets: Droplets, users: Users, wrench: Wrench };

export default function ProductVisualShowcase({ slug }) {
  const visuals = getProductVisuals(slug);
  if (!visuals) return null;

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">{visuals.eyebrow}</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">{visuals.headline}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{visuals.intro}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative mt-10 overflow-hidden">
          <img src={visuals.hero.url} alt={visuals.hero.alt} className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[540px]" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/85 to-transparent p-6 pt-16 lg:p-10 lg:pt-24">
            <div className="flex items-center gap-2">
              <ThermometerSnowflake size={16} className="text-cyan" />
              <p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan">{visuals.hero.caption}</p>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 lg:text-base">{visuals.hero.captionNote}</p>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {visuals.cards.map((card, index) => {
            const Icon = ICONS[card.icon] || Droplets;
            return (
              <motion.article key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                className="group flex flex-col overflow-hidden border border-border bg-card">
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={card.image} alt={card.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-4 font-heading text-xl text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Vizualizace ukazují typické nasazení. Pro konkrétní místo připravíme návrh, rozmístění a napojení podle vaší dokumentace.
          </p>
          <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
            Chci vizualizaci pro naše místo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}