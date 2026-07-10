import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Clock, Thermometer, Zap, CloudRain, ArrowRight } from 'lucide-react';

const FEATURES = [
{ icon: Smartphone, label: 'Ovládání z mobilu', desc: 'Zapněte, vypněte a naplánujte mlžení odkudkoliv přes aplikaci.' },
{ icon: Zap, label: 'Instalace do 30 minut', desc: 'Plug & play — zemní vrut nebo kotvení, žádné složité zapojení.' },
{ icon: CloudRain, label: 'Automatika dle počasí', desc: 'Senzory teploty a vlhkosti spouští mlžení samy, když je potřeba.' },
{ icon: Wifi, label: 'Wi-Fi & smart home', desc: 'Propojení s Apple HomeKit, Google Home i Amazon Alexa.' },
{ icon: Thermometer, label: 'Spouštěcí senzory', desc: 'Teplota, vlhkost i pohyb — mlžení reaguje na reálné podmínky.' },
{ icon: Clock, label: 'Časové plánování', desc: 'Nastavte si vlastní scénáře a denní režimy mlžení.' }];


export default function HeroFeatureGrid() {
  return (
    <div className="relative bg-slate-900 pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl mb-14">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            Katalog 2026 — Chytrá mlžidla.cz
          </span>
          <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-5">
            Mlžítka, která <span className="italic font-light text-cyan">myslí za vás.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Celá kolekce chytrých mlžítek a mlžných systémů se Smart App řízením — reagují na počasí, vlhkost i pohyb a instalují se během chvilky.
          </p>
          <Link to="/kontakt?produkt=Chytr%C3%A1%20mlžítka"
            className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">
            Poptat chytré mlžítko <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) =>
          <motion.div key={f.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-11 h-11 rounded-full bg-cyan/15 border border-cyan/25 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-cyan" />
              </div>
              <h3 className="text-white font-medium mb-1.5">{f.label}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}