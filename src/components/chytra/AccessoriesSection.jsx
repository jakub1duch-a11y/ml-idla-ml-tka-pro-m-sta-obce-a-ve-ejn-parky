import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Radio, Thermometer, Droplets, Smartphone, CloudSun, Move } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';

const ACCESSORIES = [
{ icon: Radio, label: 'Spouštěcí senzory', desc: 'Automaticky zapnou mlžení, jakmile je v okolí zaznamenán pohyb nebo přítomnost osob.' },
{ icon: Thermometer, label: 'Snímače teploty', desc: 'Hlídají okolní teplotu a spouští mlžení po překročení nastaveného limitu.' },
{ icon: Droplets, label: 'Snímače vlhkosti', desc: 'Regulují intenzitu mlžení podle aktuální vlhkosti vzduchu — žádné zbytečné mokro.' },
{ icon: Smartphone, label: 'Programovatelná aplikace', desc: 'Nastavte si vlastní scénáře, časy a limity přímo z mobilu.' },
{ icon: CloudSun, label: 'Integrace dle počasí a času', desc: 'Propojení s předpovědí počasí a denní dobou pro plně automatický provoz.' },
{ icon: Move, label: 'Pohybové senzory', desc: 'Reagují na pohyb v prostoru — ideální pro vstupy, terasy a hřiště.' }];


export default function AccessoriesSection() {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Moduly a příslušenství</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">Senzory a chytré doplňky ke každému mlžítku.</h2>
          <p className="text-slate-500 leading-relaxed">Rychlé nastavení, mobilní aplikace a plně programovatelné scénáře — přizpůsobte mlžení počasí, vlhkosti, času i pohybu.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {ACCESSORIES.map((a, i) =>
          <motion.div key={a.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <a.icon size={18} className="text-slate-900" />
              </div>
              <h3 className="text-slate-900 font-medium mb-1.5">{a.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{a.desc}</p>
            </motion.div>
          )}
        </div>

        <Link to="/kontakt?produkt=Příslušenství%20a%20senzory"
          onClick={() => trackQuickInquiryClick('Příslušenství a senzory', 'accessories_section')}
          className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
          Poptat příslušenství <ArrowRight size={16} />
        </Link>
      </div>
    </section>);

}