import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Thermometer, Wrench, ShieldCheck } from 'lucide-react';

const INFO_ITEMS = [
{ icon: Layers, label: 'Materiál', value: 'Nerezová ocel AISI 304 / 316L' },
{ icon: Thermometer, label: 'Ochlazení', value: 'Až −9 °C bez pocitu mokra' },
{ icon: Wrench, label: 'Výroba a dodání', value: 'Zakázkově, 1–8 týdnů dle modelu' },
{ icon: ShieldCheck, label: 'Servis a podpora', value: 'Instalace, záruka i servis v ČR' }];


export default function CollectionMainInfoSection() {
  return (
    <section className="py-16 lg:py-20 border-b border-slate-100 bg-[hsl(var(--accent-foreground))]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase mb-3 text-[hsl(var(--background))]">HLAVNÍ INFORMACE</p>
          <h2 className="font-heading font-light text-2xl lg:text-3xl tracking-tight text-[hsl(var(--background))]">Co potřebujete vědět o mlžných systémech HolmTec.

          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INFO_ITEMS.map((item, i) =>
          <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4">
                <item.icon size={17} className="text-slate-900 size-10" />
              </div>
              <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">{item.label}</p>
              <p className="text-sm text-slate-900 font-medium leading-snug">{item.value}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}