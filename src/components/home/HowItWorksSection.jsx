import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Zap, Wifi, Shield } from 'lucide-react';

const features = [
  {
    icon: Droplets,
    title: 'Přirozené ochlazení',
    desc: 'Evaporační mlha ochlazuje vzduch až o 9 °C bez chladiv ani kompresoru.',
  },
  {
    icon: Zap,
    title: 'Minimální spotřeba',
    desc: 'Spotřeba vody jen 6–8 litrů za hodinu. 8–15× levnější než klimatizace.',
  },
  {
    icon: Wifi,
    title: 'Smart řízení',
    desc: 'WiFi modul s automatickým řízením dle teploty a vlhkosti. Ovládání z mobilu.',
  },
  {
    icon: Shield,
    title: 'Nerezová kvalita',
    desc: 'Trysky a komponenty z nerezové oceli 316L s životností 10 000+ hodin.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Technologie evaporace</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Jak to funguje
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light">
            Nejpřirozenější chlazení na světě, dostupné pro každý prostor.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={28} className="text-slate-900" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-heading font-light text-xl text-slate-900 tracking-tight mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}