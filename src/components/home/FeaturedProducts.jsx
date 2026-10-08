import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const featured = [
  {
    name: 'Vertigo',
    desc: 'Nerezová šroubovice pnoucí se do výšky 3m.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/17b6b7c94_generated_image.png',
  },
  {
    name: 'GATE 80 — Vstupní mlžná brána',
    desc: 'Spektakulární vstupní brána s 8 tryskami.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e03a84d77_L-Mltko_GATE_60_3R-1.png',
  },
  {
    name: 'Mlžná brána - Rainbow GATE',
    desc: 'Barevný půlkruh s jemnou mlhou po obvodu — mlžiště nejen pro děti.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/7ee43ab21_generated_image.png',
  },
  {
    name: 'Mlžný Slunečník',
    desc: 'Skládací nerezová konstrukce "MLŽÍTKO" pro eventy i soukromé akce.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/bf2ac4965_generated_image.png',
  },
  {
    name: 'Icespot - Mlžný sloup',
    desc: 'Mlžný sloup je jemnou mlhou ideálně pro sedící osoby. Vandal-proof, celoroční instalace.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/b75d2a5bb_generated_image.png',
  },
  {
    name: 'mlžné brány MARATON',
    desc: 'Modulární tunel MARATON pro ochlazení velkých davů na akcích.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/3a39f6017_generated_image.png',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">NAŠE PRODUKTY</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
            Oblíbené instalace
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to="/kolekce" className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-card_bg transition-all duration-300 hover:border-cyan/40">
                <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_72%_18%,#ffffff_0%,#e8f7f9_38%,#cee6eb_100%)]">
                  <div aria-hidden className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(7,94,112,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(7,94,112,.1)_1px,transparent_1px)] [background-size:3rem_3rem]" />
                  <img src={p.image} alt={p.name} className="relative z-10 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.035]" />
                  <img aria-hidden="true" alt="" src="/media/ui/product-studio-motion.gif" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-25" />
                  <span className="absolute left-4 top-4 z-20 rounded-full border border-white/70 bg-white/75 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[#075D70] shadow-sm backdrop-blur">Studio preview</span>
                </div>
                <div className="p-5">
                  <h3 className="font-normal text-white mb-1 group-hover:text-cyan transition-colors">{p.name}</h3>
                  <p className="text-sm text-white/50">{p.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/kolekce"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 hover:border-cyan/40 transition-all">
            Všechny produkty <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}