import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Clock, Layers, Droplets, ArrowRight } from 'lucide-react';
import SmartControlVisual from '@/components/home/SmartControlVisual';

const features = [
{ icon: Wifi, label: 'WiFi + Bluetooth', sub: 'Dual konektivita' },
{ icon: Clock, label: 'Automatické plány', sub: 'Časovač i senzory' },
{ icon: Layers, label: 'Skupinové scény', sub: 'Více zón najednou' },
{ icon: Droplets, label: 'Vodní monitoring', sub: 'Spotřeba v reálu' }];


export default function SmartSection() {
  return (
    <section className="py-24 bg-background overflow-hidden border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-mono text-secondary tracking-widest uppercase mb-6">
              Automatizace mlžítek
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-heading text-4xl lg:text-5xl text-foreground tracking-tight mb-6">
              Chladí, když je potřeba.<br />Vy řídíte jen dotykem.
            </motion.h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Aplikace HolmTec propojuje časové plány, senzory a jednotlivé zóny. Mlžítka se spustí přesně podle podmínek vašeho prostoru.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f, i) =>
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
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/kalkulacka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Spočítat provozní náklady <ArrowRight size={16}/>
              </Link>
              <Link to="/smart-ovladani" className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-secondary hover:text-foreground">
                Chytrá aplikace a automatizace <ArrowRight size={16}/>
              </Link>
            </div>
          </motion.div>

          <SmartControlVisual />
        </div>
      </div>
    </section>);

}