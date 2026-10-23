import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Droplets, Ruler, Gauge } from 'lucide-react';

export default function MrakVariantHero({ model, content }) {
  const chips = [
    { icon: Ruler, label: 'Výška', value: model.height },
    { icon: Droplets, label: 'Trysky', value: `${model.count} ks` },
    { icon: Gauge, label: 'Průtok', value: `${(model.count * 6.4).toFixed(1).replace('.', ',')} l/h` },
  ];
  return (
    <section className="relative overflow-hidden bg-secondary px-5 pb-16 pt-28 text-secondary-foreground sm:px-10">
      <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/produkt/mlzitko-mrak" className="inline-flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-accent"><ArrowLeft size={14} /> Řada MRAK</Link>
          <p className="mt-8 font-mono text-xs tracking-[0.2em] text-accent">{model.concept ? 'DESIGNOVÝ NÁVRH' : 'KATALOGOVÁ VARIANTA'}</p>
          <h1 className="mt-4 font-heading text-secondary-foreground">{model.name}</h1>
          <p className="mt-5 max-w-xl text-lg text-secondary-foreground/80">{content.tagline}</p>
          <p className="mt-3 max-w-xl text-sm text-secondary-foreground/60">{content.shape}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={`/poptavka?produkt=mlzitko-mrak&varianta=${model.id}`} className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-heading text-sm font-semibold text-accent-foreground hover:bg-primary-foreground">Poptat variantu <ArrowRight size={16} /></Link>
            <a href="#parametry" className="inline-flex items-center border border-secondary-foreground/30 px-6 py-3 font-heading text-sm font-semibold hover:border-accent">Parametry</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
          <div className="aspect-square border border-secondary-foreground/15 bg-primary-foreground">
            <img src={model.image} alt={`${model.name} · tvar varianty`} className="h-full w-full object-contain p-6" />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-3 gap-2 sm:left-8 sm:right-8">
            {chips.map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-secondary-foreground/15 bg-secondary/90 p-3 backdrop-blur">
                <Icon size={16} className="text-accent" />
                <p className="mt-2 text-[10px] uppercase tracking-widest text-secondary-foreground/60">{label}</p>
                <p className="font-heading text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}