import React from 'react';
import { motion } from 'framer-motion';

const BENEFITS = [
{ n: '01', title: 'Boj s tepelnými ostrovy', desc: 'Mlžící brány a plastiky ochlazují přehřátá náměstí, parky a bulváry ve městech.' },
{ n: '02', title: 'Nízká spotřeba vody', desc: 'Oproti klasickému zavlažování nebo fontánám spotřebuje mlžení jen zlomek vody.' },
{ n: '03', title: 'Bez chemikálií a freonů', desc: 'Adiabatické chlazení odparem funguje čistě fyzikálně — bez klimatizace a chladiv.' },
{ n: '04', title: 'Podpora zeleně a mikroklimatu', desc: 'Zvlhčení vzduchu prospívá okolní vegetaci a snižuje prašnost v okolí.' }];


export default function SustainabilityBenefits() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Dopad na životní prostředí</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Proč je mlžení šetrné řešení.</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {BENEFITS.map((b, i) =>
          <motion.div key={b.n} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="flex items-start gap-6 py-8">
              <span className="text-5xl font-heading font-light text-slate-100 leading-none shrink-0">{b.n}</span>
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-1.5">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{b.desc}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}