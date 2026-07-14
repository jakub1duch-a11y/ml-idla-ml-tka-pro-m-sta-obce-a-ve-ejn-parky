import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Clock, Layers, Droplets, Radar, Cpu, ArrowRight } from 'lucide-react';

const features = [
  { icon: Wifi, label: 'WiFi + Bluetooth', sub: 'Dual konektivita' },
  { icon: Clock, label: 'Automatické plány', sub: 'Časovač i senzory' },
  { icon: Layers, label: 'Skupinové scény', sub: 'Více zón najednou' },
  { icon: Droplets, label: 'Vodní monitoring', sub: 'Spotřeba v reálu' },
];

const HOW_IT_WORKS = [
  { icon: Radar, label: 'Senzory sbírají data', sub: 'Teplota, vlhkost, vítr, pohyb' },
  { icon: Cpu, label: 'Aplikace vyhodnotí', sub: 'Porovná s vaším scénářem' },
  { icon: Droplets, label: 'Mlžení se spustí samo', sub: 'Zapne, upraví, vypne' },
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
              Mlžení z mobilu.<br />Kdykoli. Odkudkoli.
            </motion.h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Aplikace HolmTec zobrazuje teplotu, vlhkost, spotřebu vody a stav systému v reálném čase. Automatické plány, scény, skupinové ovládání.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((f, i) => (
                <motion.div key={f.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.1, duration: 0.4, ease: 'backOut' }}>
                    <f.icon size={18} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.label}</p>
                    <p className="text-xs text-slate-400">{f.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Jak Smart systém funguje — mini flow */}
            <div className="mb-8">
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Jak to funguje</p>
              <div className="flex items-center gap-2">
                {HOW_IT_WORKS.map((s, i) => (
                  <React.Fragment key={s.label}>
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                        <s.icon size={14} className="text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{s.label}</p>
                        <p className="text-[11px] text-slate-400 truncate">{s.sub}</p>
                      </div>
                    </div>
                    {i < HOW_IT_WORKS.length - 1 && <ArrowRight size={13} className="text-slate-300 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/smart-ovladani"
                className="btn-metallic-mist px-7 py-3.5 text-sm font-medium">
                Zjistit více o Smart řízení
              </Link>
              <Link to="/kontakt"
                className="inline-flex items-center px-7 py-3.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-full hover:border-slate-400 transition-colors">
                Spočítat náklady
              </Link>
            </div>
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