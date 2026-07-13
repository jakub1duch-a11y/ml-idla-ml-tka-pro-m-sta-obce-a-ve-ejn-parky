import React from 'react';
import { motion } from 'framer-motion';
import { CloudFog, Droplet, Thermometer, ShowerHead, Gauge, Layers } from 'lucide-react';

const ITEMS = [
  { icon: CloudFog, label: 'Suchá mlha', desc: 'Kapky 5–10 µm bez pocitu mokra' },
  { icon: Droplet, label: 'Mikro-kapky', desc: 'Okamžitý odpar ve vzduchu' },
  { icon: Thermometer, label: 'Ochlazení', desc: 'Až −9 °C v okolí instalace' },
  { icon: ShowerHead, label: 'Tryska', desc: 'Nerezová tryska HT-LT, tlak 70 bar' },
  { icon: Gauge, label: 'Ventil', desc: 'Automatické řízení průtoku' },
  { icon: Layers, label: 'Nerez 316L', desc: 'Potravinářská ocel, bez koroze' },
];

export default function MlzidlaInfoBoxes() {
  return (
    <section className="bg-black py-20 lg:py-28 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brushed/60 mb-3">01 — Princip</p>
        <h2 className="font-heading font-black text-3xl lg:text-4xl text-white uppercase tracking-tight mb-14">Co jsou mlžítka</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-brushed/30">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-6 lg:p-7 border-brushed/30 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 3 ? 'border-b lg:border-b-0' : ''} ${i > 0 ? 'border-t md:border-t-0' : ''} border-r last:border-r-0 lg:border-r`}
                style={{ background: 'linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)' }}
              >
                <div className="w-10 h-10 flex items-center justify-center border border-brushed/40 mb-4">
                  <Icon size={18} className="text-techblue" strokeWidth={1.5} />
                </div>
                <h3 className="text-white text-sm font-bold uppercase tracking-wide mb-1.5">{item.label}</h3>
                <p className="text-brushed/60 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}