import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Clock, Layers, Droplets } from 'lucide-react';

const features = [
  { icon: Wifi, label: 'WiFi + Bluetooth', sub: 'Dual konektivita' },
  { icon: Clock, label: 'Automatické plány', sub: 'Časovač i senzory' },
  { icon: Layers, label: 'Skupinové scény', sub: 'Více zón najednou' },
  { icon: Droplets, label: 'Vodní monitoring', sub: 'Spotřeba v reálu' },
];

export default function SmartSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 tracking-widest uppercase mb-6">
              Smart ovládání
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-6">
              Mlžení z mobilu.<br /><span className="italic">Kdykoli. Odkudkoli.</span>
            </motion.h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Aplikace HolmTec zobrazuje teplotu, vlhkost, spotřebu vody a stav systému v reálném čase. Automatické plány, scény, skupinové ovládání.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <f.icon size={18} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.label}</p>
                    <p className="text-xs text-slate-400">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all">
              Spočítat náklady
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://media.base44.com/images/public/69f87b0204346ce73cee73b1/ae189a9d2_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ.png"
                alt="Smart app" className="w-full rounded-2xl border border-slate-200" />
              <img src="https://media.base44.com/images/public/69f87b0204346ce73cee73b1/4d63dd88b_videoframe_7589.png"
                alt="Smart app 2" className="w-full rounded-2xl border border-slate-200 mt-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}