import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FACTS = [
  ['Rozměr', '2 × 2,2 m, upravitelné'],
  ['Spotřeba', '15–25 l/h'],
  ['Tlak', '3–7 bar, bez čerpadla'],
  ['Řízení', 'Wi-Fi, teplota, čas, senzor']
];

export default function CityGatesSection() {
  return (
    <section className="bg-primary py-20 text-primary-foreground lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ecaf9a72b_file_0000000075bc82108187190f4dd478c4.png"
            alt="Děti probíhají mlžnou bránou u městského koupaliště"
            className="h-[300px] w-full object-cover sm:h-[420px]"
            loading="lazy" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-accent">Novinka v městské kolekci</p>
          <h2 className="mt-4 font-heading text-3xl lg:text-4xl">Mlžné brány — vstup, který si lidé zapamatují.</h2>
          <p className="mt-5 text-lg leading-relaxed text-primary-foreground/75">
            Nerezová brána na vstupu do parku, na koupaliště nebo na náměstí ochladí procházející a zároveň funguje jako výrazný prvek veřejného prostoru. Rozměr i tvar navrhneme podle vaší dokumentace.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-px bg-white/15">
            {FACTS.map(([label, value]) => (
              <div key={label} className="bg-primary p-4">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-primary-foreground/50">{label}</p>
                <p className="mt-1.5 text-sm font-semibold text-primary-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/mlzne-brany" className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary-foreground">
              Prohlédnout mlžné brány <ArrowRight size={16} />
            </Link>
            <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center border border-white/40 px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10">
              Poptat bránu pro naše město
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}