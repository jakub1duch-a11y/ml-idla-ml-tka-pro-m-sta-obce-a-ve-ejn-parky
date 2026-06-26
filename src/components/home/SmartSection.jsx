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
    <section className="py-24 bg-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-xs font-mono text-cyan tracking-widest uppercase mb-6">
              Smart ovládání
            </div>
            <h2 className="font-heading font-black text-4xl lg:text-5xl text-white tracking-tight mb-6">
              Mlžení z mobilu.<br /><span className="text-cyan">Kdykoli. Odkudkoli.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Aplikace HolmTec zobrazuje teplotu, vlhkost, spotřebu vody a stav systému v reálném čase. Automatické plány, scény, skupinové ovládání.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <f.icon size={18} className="text-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-white/40">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
              Spočítat náklady
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://media.base44.com/images/public/69f87b0204346ce73cee73b1/ae189a9d2_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ.png"
                alt="Smart app" className="w-full rounded-2xl border border-white/10" />
              <img src="https://media.base44.com/images/public/69f87b0204346ce73cee73b1/4d63dd88b_videoframe_7589.png"
                alt="Smart app 2" className="w-full rounded-2xl border border-white/10 mt-8" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}