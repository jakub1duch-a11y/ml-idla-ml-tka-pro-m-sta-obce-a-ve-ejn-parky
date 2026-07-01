import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Cpu, Shield } from 'lucide-react';

const features = [
  { icon: Thermometer, title: 'Přirozené ochlazení', desc: 'Evaporační mlha ochlazuje vzduch až o 9 °C bez chladiv ani kompresoru.' },
  { icon: Droplets, title: 'Minimální spotřeba', desc: 'Spotřeba vody jen 6–8 litrů za hodinu. 8–15× levnější než klimatizace.' },
  { icon: Cpu, title: 'Smart řízení', desc: 'WiFi modul s automatickým řízením dle teploty a vlhkosti. Ovládání z mobilu.' },
  { icon: Shield, title: 'Nerezová kvalita', desc: 'Trysky a komponenty z nerezové oceli 316L s životností 10 000+ hodin.' },
];

export default function TechSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Jak to funguje</p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Technologie mlžení
          </motion.h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Technologie evaporace — nejpřirozenější chlazení na světě, dostupné pro každý prostor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-all">
                <f.icon size={20} className="text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="font-normal text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}