import React from 'react';
import { motion } from 'framer-motion';
import { Square, Waves, Sparkles } from 'lucide-react';

const MODELS = [
  {
    id: 'geometric',
    icon: Square,
    name: 'Geometric 26',
    tag: 'Hranaté linie',
    desc: 'Čisté hranaté linie pro moderní developerské projekty, firemní sídla a atria.',
    specs: ['Povrch: leštěný / kartáčovaný', 'Trysky: laserem vrtané, 42 mm profil'],
  },
  {
    id: 'organic',
    icon: Waves,
    name: 'Organic Wave',
    tag: 'Přírodní křivky',
    desc: 'Hladké, ručně zakřivené nerezové křivky inspirované přírodou — ideální do parků a relaxačních zón.',
    specs: ['Povrch: leštěný / kartáčovaný', 'Trysky: laserem vrtané, 42 mm profil'],
  },
  {
    id: 'custom',
    icon: Sparkles,
    name: 'Custom Icon',
    tag: 'Zakázkový tvar',
    desc: 'Zakázková výroba specifických tvarů — nerezové hvězdy, loga firem nebo městské znaky.',
    specs: ['Povrch: leštěný / kartáčovaný', 'Trysky: laserem vrtané, 42 mm profil'],
  },
];

export default function Collection2026Section() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Kolekce 2026</p>
          <h2 className="font-heading font-light text-3xl lg:text-5xl text-white tracking-tight leading-[1.1]">
            Limitovaná kolekce 2026: Budoucnost městského osvěžení
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODELS.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/10 transition-shadow duration-500 hover:shadow-[0_0_50px_10px_rgba(56,189,248,0.25)] hover:border-cyan-400/30">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-cyan-400/40 transition-colors">
                <m.icon size={20} className="text-white/70 group-hover:text-cyan-300 transition-colors" strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-mono text-cyan-300/70 tracking-widest uppercase mb-2">{m.tag}</p>
              <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-3">{m.name}</h3>
              <p className="text-sm text-white/50 font-light leading-relaxed mb-6">{m.desc}</p>
              <div className="space-y-2 pt-5 border-t border-white/10">
                {m.specs.map((s) => (
                  <p key={s} className="text-[11px] font-mono text-white/40 tracking-wide">{s}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}