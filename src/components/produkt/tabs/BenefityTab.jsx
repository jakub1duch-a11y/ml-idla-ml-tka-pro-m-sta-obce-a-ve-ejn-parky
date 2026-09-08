import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, ShieldCheck, Gauge, Sparkles, Wrench } from 'lucide-react';

export default function BenefityTab({ product }) {
  const items = [
    { icon: Droplets, title: 'Příjemné ochlazení', text: 'Jemná vodní mlha zlepšuje pocitový komfort venkovního prostoru při správném návrhu a provozu.' },
    product.pressure && { icon: Gauge, title: 'Provozní parametry', text: `Tlak podle technických dat produktu: ${product.pressure}.` },
    product.material && { icon: ShieldCheck, title: 'Odolné provedení', text: `Materiál: ${product.material}.` },
    { icon: Sparkles, title: 'Architektonický výraz', text: 'Produkt je navržen jako viditelná součást prostoru, ne jako dodatečně přidaná technická instalace.' },
    { icon: Wrench, title: 'Projektové řešení', text: 'Kotvení, přívod vody, počet kusů a smart řízení se navrhují podle konkrétní lokality.' }
  ].filter(Boolean);

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[.2em] text-slate-400">Přínosy produktu</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">Klíčové vlastnosti bez univerzálních slibů.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">Zobrazujeme pouze obecné přínosy principu a technické hodnoty uložené přímo u produktu {product.name}.</p>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} whileHover={{ y: -3 }} className="rounded-[18px] border border-slate-200 bg-[#fbfdfe] p-5 transition-all hover:border-cyan-200 hover:shadow-[0_12px_30px_rgba(11,72,96,.06)]">
              <Icon size={24} className="text-[#39b9e6]" strokeWidth={1.7}/>
              <h3 className="mt-4 text-sm font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
