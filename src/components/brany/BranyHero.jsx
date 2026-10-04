import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BranyHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 lg:pt-32 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-secondary">Městská kolekce · Mlžné brány</p>
          <h1 className="mt-4 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">Mlžná brána pro veřejný prostor.</h1>
          <p className="text-measure mt-5 text-lg leading-relaxed text-muted-foreground">
            Nerezová konstrukce AISI 316L s jemným mlžením na vstupu do parku, na koupaliště, promenádu nebo náměstí. Ochladí procházející až o 9 °C a nenechá po sobě mokrý povrch.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              Poptat mlžnou bránu <ArrowRight size={16} />
            </Link>
            <Link to="/gate70" className="inline-flex min-h-12 items-center justify-center border border-border px-7 py-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
              Detail modelu GATE70
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }}>
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ecaf9a72b_file_0000000075bc82108187190f4dd478c4.png"
            alt="Mlžná brána z nerezové oceli na vstupu k městskému koupališti"
            className="h-[300px] w-full object-cover shadow-[0_12px_32px_rgba(10,22,40,0.12)] sm:h-[420px] lg:h-[500px]"
            loading="eager" />
        </motion.div>
      </div>
    </section>
  );
}