import React from 'react';
import { motion } from 'framer-motion';

const ThermometerIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 4a2 2 0 1 0-4 0v9.5a3.5 3.5 0 1 0 4 0V4Z" />
    <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
  </svg>
);

const MistCloudIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 15a4 4 0 1 1 1.2-7.8A5 5 0 0 1 18 9.5 3.5 3.5 0 0 1 17.5 15H7Z" />
    <path d="M5 19c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0" />
  </svg>
);

const NozzleIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="2" width="6" height="14" rx="1.5" />
    <path d="M12 16v3M8 22h8M9 22v-2.5M15 22v-2.5" />
  </svg>
);

const FEATURES = [
  {
    icon: ThermometerIcon,
    title: 'Okamžité ochlazení',
    desc: 'Pocitová teplota v okolí klesá o 10–12 °C během několika vteřin od spuštění mlžení.',
  },
  {
    icon: MistCloudIcon,
    title: 'Jemná mikro-mlha',
    desc: 'Suchá mlha o velikosti kapek 10–50 μm se odpaří dřív, než dopadne — oblečení zůstává suché.',
  },
  {
    icon: NozzleIcon,
    title: 'Nerezové mikro-trysky',
    desc: 'Laserem vrtané trysky integrované přímo v 42mm nerezovém profilu, bez viditelných spojů.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Kvalita</p>
          <h2 className="font-heading font-light text-3xl lg:text-5xl text-slate-900 tracking-tight">
            Nekompromisní kvalita a zpracování
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 text-slate-500 group-hover:text-sky-500 group-hover:border-sky-200 group-hover:-translate-y-1 transition-all duration-300">
                <f.icon />
              </div>
              <h3 className="font-heading text-lg text-slate-900 font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}