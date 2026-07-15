import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';

const POINTS = [
  { icon: Sparkles, title: 'Precizní technologie', desc: 'Trysky s mikro-kapkami, které se odpaří dřív, než dopadnou na zem.' },
  { icon: ShieldCheck, title: 'Odolný materiál', desc: 'Nerezová ocel AISI 316L odolává korozi po celý rok.' },
  { icon: Leaf, title: 'Ekologický provoz', desc: 'Nízká spotřeba vody a energie, šetrné k životnímu prostředí.' },
];

const STATS = [
  { value: '500+', label: 'Realizací' },
  { value: '15 000+', label: 'Spokojených klientů' },
  { value: '12 let', label: 'Zkušeností' },
  { value: '99 %', label: 'Spokojenost' },
];

const IMG = 'https://images.unsplash.com/photo-1441829266145-1d1a2380f9d6?q=80&w=1000&auto=format&fit=crop';

export default function AboutSection6() {
  return (
    <section className="bg-white py-24 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          <div>
            <p className="text-sm font-semibold text-violet-600 mb-4">O nás</p>
            <h2 className="font-heading font-light text-slate-900 tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Zvyšte komfort, snižte teplotu s chytrým mlžením.
            </h2>
          </div>
          <div className="bg-slate-50 rounded-2xl p-7">
            <p className="text-slate-500 leading-relaxed mb-5">
              Pomáháme firmám i domácnostem využít sílu mlžení. Naše zakázková řešení mění horké letní dny v příjemný chlad.
            </p>
            <Link to="/o-nas" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-full transition-colors">
              Zjistit více <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden aspect-[3/4]">
            <img src={IMG} alt="Instalace mlžení" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col gap-6">
            {POINTS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 items-start pb-6 border-b border-slate-100 last:border-b-0">
                <p.icon size={20} className="text-violet-600 shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-slate-900 mb-1">{p.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-heading font-semibold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}