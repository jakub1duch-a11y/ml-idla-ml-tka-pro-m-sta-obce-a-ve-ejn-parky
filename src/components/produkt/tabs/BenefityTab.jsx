import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, ShieldCheck, Gauge, Leaf } from 'lucide-react';

const STATS = [
  { val: '−10 °C', label: 'Pokles teploty okolí', icon: Thermometer, desc: 'Evaporativní chlazení mikrokapkami sníží teplotu vzduchu v okolí až o 10 °C během několika minut provozu.' },
  { val: 'ČSN EN 1176', label: 'Certifikace bezpečnosti', icon: ShieldCheck, desc: 'Konstrukce i mlžení splňují normu pro veřejná dětská hřiště a náměstí — bezpečné pro děti i seniory.' },
  { val: '2–7 BAR', label: 'Nízkotlaký provoz', icon: Gauge, desc: 'Systém pracuje na běžném tlaku vodovodního řadu, bez nutnosti čerpadel nebo vysokotlakých kompresorů.' },
  { val: '−45 %', label: 'Úspora vody', icon: Leaf, desc: 'Chytrá regulace dle počasí a teploty šetří vodu oproti nepřerušovanému provozu.' },
];

function StatCard({ s }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="p-6 rounded-2xl border border-slate-200 bg-white text-center transition-shadow hover:shadow-md">
      <motion.div animate={hovered ? { y: [0, -5, 0], scale: 1.1 } : { y: 0, scale: 1 }} transition={{ duration: 0.6 }} className="flex justify-center mb-3">
        <s.icon size={20} className="text-slate-400" />
      </motion.div>
      <p className="font-heading font-bold text-2xl text-slate-900 tracking-tight">{s.val}</p>
      <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mt-2">{s.label}</p>
      <AnimatePresence>
        {hovered && (
          <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 10 }} exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }} className="text-xs text-slate-500 font-light leading-relaxed overflow-hidden">
            {s.desc}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BenefityTab({ product }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Benefity a přínosy</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-5">
            Příjemné mikroklima,<br /><span className="text-slate-400">certifikovaná bezpečnost.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Pokles teploty okolí, pohlcování prachu a pylů, nízkotlaký úsporný provoz. {product.name} je certifikováno pro veřejná dětská hřiště a náměstí dle ČSN EN 1176.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s) => <StatCard key={s.label} s={s} />)}
        </div>
      </div>
    </section>
  );
}