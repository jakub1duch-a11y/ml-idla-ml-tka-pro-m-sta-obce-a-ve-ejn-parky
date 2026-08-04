import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wifi, Clock, Layers, Droplets, ArrowRight } from 'lucide-react';
import SmartControlVisual from '@/components/home/SmartControlVisual';

const features = [
{ icon: Wifi, label: 'Google Assistant + Alexa', sub: 'Hlasové ovládání' },
{ icon: Clock, label: 'Automatické plány', sub: 'Podle času i teploty' },
{ icon: Layers, label: 'Zóny a scény', sub: 'Každé místo (mlžítko)zvlášť' },
{ icon: Droplets, label: 'Přehled průtoku vody', sub: 'Kontrola spotřeby v reálných číslech' }];


export default function SmartSection() {
  return (
    <section className="overflow-hidden border-y border-border bg-[hsl(var(--accent-foreground))] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/20 text-xs font-mono tracking-widest uppercase mb-6 bg-[hsl(var(--popover-foreground))] text-[hsl(var(--card-foreground))]">
              Smart mlžení · WiFi / aplikace
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-heading text-4xl lg:text-5xl tracking-tight mb-6 text-[hsl(var(--input))]">
              Automatizace, která šetří vodu i váš čas. Bez starostí.
            </motion.h2>
            <p className="text-lg leading-relaxed mb-8 text-[hsl(var(--secondary-foreground))]">Provoz pod kontrolou WiFi. Ovládejte průtok, plán mlžení a zóny přes WiFi aplikaci v mobilním zařízení. Přehledná analytika ukazuje spotřebu, úspory i stav zařízení — mlžítka pak pracují sama.

            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f, i) =>
              <motion.div key={f.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.1, duration: 0.4, ease: 'backOut' }}>
                    <f.icon size={18} className="text-slate-700 mt-0.5 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 [font-family:'Plus_Jakarta_Sans',_sans-serif]">{f.label}</p>
                    <p className="text-xs text-slate-400">{f.sub}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/kalkulacka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Spočítat provozní náklady <ArrowRight size={16} />
              </Link>
              <Link to="/smart-ovladani" className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-secondary hover:text-foreground bg-[hsl(var(--card))] rounded-[20px]">Automatizace mlžítek

              </Link>
            </div>
          </motion.div>

          <SmartControlVisual />
        </div>
      </div>
    </section>);

}