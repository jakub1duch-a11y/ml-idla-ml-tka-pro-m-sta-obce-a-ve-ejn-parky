import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Factory, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: Camera, title: 'Poptávka a fotografie místa', desc: 'Pošlete nám pár fotek prostoru a popište, co potřebujete ochladit. My navážeme do 24 hodin.' },
  { icon: Sparkles, title: 'AI vizualizace a nabídka', desc: 'Připravíme vizualizaci mlžítka ve vašem prostoru a cenovou nabídku s technickými parametry.' },
  { icon: Factory, title: 'Výroba, instalace a zaškolení', desc: 'Po potvrzení nabídky vyrobíme mlžítko na míru, nainstalujeme a naučíme vás jej ovládat.' },
];

export default function HowItWorksSteps() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
          <p className="font-mono tracking-widest uppercase text-slate-400 mb-2 text-xs">JAK TO PROBÍHÁ</p>
          <h2 className="font-heading font-medium tracking-tight text-slate-900 text-[clamp(1.75rem,5vw,2.5rem)]">
            Od poptávky poochlazený prostor
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="relative"
              >
                <div className="flex flex-col items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mb-4">
                    <Icon size={24} className="text-[#0b4860]" />
                  </div>
                  <div className="absolute -top-1 right-0 font-heading text-5xl font-light text-slate-100 leading-none select-none">
                    {i + 1}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-7 -right-3 text-slate-200">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link to="/ai-vizualizace" className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-[#082934] transition hover:-translate-y-0.5">
            <Sparkles size={16} /> Vyzkoušet AI vizualizaci <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}