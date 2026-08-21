import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CalendarClock, Droplets, BarChart3, Bell, Layers } from 'lucide-react';

const BENEFITS = [
{ icon: Smartphone, title: 'Vzdálené ovládání', desc: 'U podporované konfigurace můžete mlžení ovládat a plánovat také vzdáleně.' },
{ icon: CalendarClock, title: 'Automatické scénáře', desc: 'Nastavte scénáře podle času, teploty a podle konfigurace dalších senzorů.' },
{ icon: Droplets, title: 'Efektivní využití vody', desc: 'Mlžení běží jen tehdy, kdy má podle nastavených podmínek skutečně smysl.' },
{ icon: BarChart3, title: 'Provozní přehled', desc: 'Podle konfigurace lze sledovat stav systému, zón a provozních scénářů.' },
{ icon: Bell, title: 'Stavová upozornění', desc: 'U podporované konfigurace lze doplnit vzdálená stavová upozornění a diagnostiku.' },
{ icon: Layers, title: 'Více zařízení najednou', desc: 'Více mlžítek lze podle návrhu rozdělit do samostatně řízených zón.' }];


export default function SmartBenefits() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Výhody smart řízení</p>
          <h2 className="font-heading font-light text-3xl leading-tight lg:text-4xl text-slate-900 tracking-tight">Kontrola nad provozem bez každodenní obsluhy.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) =>
          <motion.div key={b.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm">
              <b.icon size={38} strokeWidth={1.6} className="mb-5 text-secondary" />
              <h3 className="font-heading text-xl text-foreground mb-1.5">{b.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}