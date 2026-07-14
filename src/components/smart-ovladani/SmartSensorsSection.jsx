import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Radar, CloudRain, Wind, ToggleLeft } from 'lucide-react';

const SENSORS = [
{ icon: Thermometer, title: 'Teplotní senzor', desc: 'Spustí mlžení po dosažení nastavené teploty vzduchu.' },
{ icon: Droplets, title: 'Senzor vlhkosti', desc: 'Hlídá optimální mikroklima v okolí mlžítka.' },
{ icon: Radar, title: 'PIR senzor pohybu', desc: 'Mlžení jen tehdy, když je v prostoru skutečně někdo.' },
{ icon: CloudRain, title: 'Předpověď počasí', desc: 'Systém neběží zbytečně za deště.' },
{ icon: Wind, title: 'Senzor větru', desc: 'Při silném poryvu automaticky zastaví nebo omezí mlžení.' },
{ icon: ToggleLeft, title: 'Manuální tlačítko', desc: 'Spolehlivá záloha — zapnutí kdykoliv i bez aplikace.' }];


export default function SmartSensorsSection() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Napojení na chytré senzory</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Systém reaguje na reálné podmínky.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SENSORS.map((s, i) =>
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all">
              <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                <s.icon size={18} className="text-cyan" />
              </div>
              <h3 className="text-slate-900 font-medium mb-1.5">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}