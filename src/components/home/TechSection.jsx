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
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Jak to funguje</p>
          <h2 className="font-heading font-black text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Technologie mlžení
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Technologie evaporace — nejpřirozenější chlazení na světě, dostupné pro každý prostor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card_bg border border-white/10 hover:border-cyan/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center mb-4 group-hover:bg-cyan/20 transition-all">
                <f.icon size={20} className="text-cyan" />
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}