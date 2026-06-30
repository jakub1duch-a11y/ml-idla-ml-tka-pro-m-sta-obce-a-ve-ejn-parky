import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Sparkles, Waves, Hand, Smartphone, Cpu } from 'lucide-react';

const COMBINATIONS = [
  {
    nozzles: 3,
    name: 'Mini oáza',
    subtitle: 'Kombinace 3 mlžidel',
    price: 'od 42 000 Kč',
    desc: 'Ideální pro menší terasu nebo zahradní koutek. Jemné osvěžení pro celou rodinu.',
    control: { icon: Hand, label: 'Ruční ovládání' },
    icon: Droplets,
  },
  {
    nozzles: 5,
    name: 'Rodinné mlhoviště',
    subtitle: 'Kombinace 5 mlžidel',
    price: 'od 68 000 Kč',
    desc: 'Větší plocha pro hru i odpočinek. Plynulé pokrytí zahrady jemnou mlhou.',
    control: { icon: Smartphone, label: 'Smart WiFi ovládání' },
    icon: Sparkles,
    featured: true,
  },
  {
    nozzles: 7,
    name: 'Velké mlžiště',
    subtitle: 'Kombinace 7 mlžidel',
    price: 'od 95 000 Kč',
    desc: 'Rozsáhlé mlhovací hřiště pro velké zahrady, hřiště nebo veřejné prostory.',
    control: { icon: Cpu, label: 'Automatické senzory & časovač' },
    icon: Waves,
  },
];

export default function ModuleCombinations() {
  return (
    <section id="konfigurace" className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-2xl">
        <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Mlžiště na zakázku</p>
        <h2 className="font-heading font-light text-3xl lg:text-5xl text-white tracking-tight mb-4">
          Vyberte si ideální kombinaci mlžicích modulů
        </h2>
        <p className="text-white/50 text-lg leading-relaxed font-light">
          Nabízíme flexibilní sestavy, které můžete libovolně kombinovat. Od malého osvěžení po rozsáhlá mlhovací hřiště.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COMBINATIONS.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className={`rounded-2xl overflow-hidden border transition-all flex flex-col ${c.featured ? 'border-cyan/40 bg-gradient-to-b from-cyan/10 to-card_bg' : 'border-white/10 bg-card_bg'}`}>
            {c.featured && (
              <div className="px-6 py-2 bg-cyan/20 border-b border-cyan/20">
                <span className="text-xs font-mono text-cyan tracking-widest uppercase">Nejoblíbenější</span>
              </div>
            )}
            <div className="p-7 flex flex-col flex-1">
              <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center mb-5 border border-cyan/20">
                <c.icon size={22} className="text-cyan" />
              </div>
              <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">{c.subtitle}</p>
              <h3 className="font-heading font-medium text-2xl text-white mb-1">{c.name}</h3>
              <p className="text-cyan font-bold mb-4">{c.price}</p>
              <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">{c.desc}</p>
              <div className="flex items-center gap-2 text-xs text-white/45 font-mono mb-6 px-3 py-2 rounded-lg bg-white/5 border border-white/8">
                <c.control.icon size={14} className="text-cyan/70 shrink-0" />
                {c.control.label}
              </div>
              <Link to="/poptavka"
                className={`block text-center px-6 py-3 text-sm font-bold rounded-full transition-all ${c.featured ? 'bg-cyan text-ink hover:bg-cyan/90 shadow-lg shadow-cyan/25' : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'}`}>
                Poptat tuto kombinaci
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}