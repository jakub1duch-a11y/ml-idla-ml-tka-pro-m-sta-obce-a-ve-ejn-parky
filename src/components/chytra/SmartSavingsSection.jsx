import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CloudSun, Droplets, Clock, Move } from 'lucide-react';
import SavingsCalculator from './SavingsCalculator';
import SpecialistContactForm from './SpecialistContactForm';
import SmartFaq from './SmartFaq';

const INTEGRATIONS = [
{ icon: CloudSun, label: 'Integrace dle počasí' },
{ icon: Droplets, label: 'Integrace dle vlhkosti vzduchu' },
{ icon: Clock, label: 'Integrace dle denní doby' },
{ icon: Move, label: 'Integrace dle pohybu v prostoru' }];


export default function SmartSavingsSection() {
  return (
    <section id="smart-kontakt" className="bg-white border-t border-slate-200 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a4d6333cb_generated_image.png" alt="Technik při údržbě chytrého mlžítka na rezidenčním eventu"
              className="w-full rounded-3xl object-cover aspect-[4/3]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Kolik ušetříte se Smart systémem</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
              Méně vody, méně energie, <span className="italic">stejný chladivý efekt.</span>
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Chytré senzory hlídají teplotu, vlhkost, čas i pohyb a mlžení spouští jen tehdy, kdy má smysl. Výsledkem je výrazná úspora vody i elektřiny bez ztráty komfortu.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {INTEGRATIONS.map((it) =>
              <div key={it.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <it.icon size={16} className="text-slate-900 shrink-0" />
                  <span className="text-xs text-slate-600">{it.label}</span>
                </div>
              )}
            </div>
            <a href="#smart-kontakt"
              className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
              Zanechte nám kontakt <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>

        <div className="mb-16">
          <SavingsCalculator />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Máte dotaz?</p>
            <h3 className="font-heading font-light text-2xl text-slate-900 tracking-tight mb-6">Než se rozhodnete.</h3>
            <SmartFaq />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 lg:p-8">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-2">Nezávazně</p>
            <h3 className="font-heading font-light text-2xl text-slate-900 tracking-tight mb-2">Zanechte nám váš kontakt</h3>
            <p className="text-sm text-slate-500 mb-6">Náš zkušený specialista se s vámi spojí a probere možnosti Smart systému pro váš prostor.</p>
            <SpecialistContactForm />
          </div>
        </div>
      </div>
    </section>);

}