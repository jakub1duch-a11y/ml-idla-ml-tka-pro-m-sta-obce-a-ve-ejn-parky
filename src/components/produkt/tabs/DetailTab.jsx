import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, ShieldCheck, Gauge, Leaf } from 'lucide-react';

const BENEFITS = [
{ icon: Thermometer, title: 'Ochlazení až o 10 °C', desc: 'Evaporativní mikroklima okamžitě snižuje teplotu okolí.' },
{ icon: ShieldCheck, title: 'Certifikovaná bezpečnost', desc: 'Splňuje ČSN EN 1176 pro veřejná dětská hřiště a náměstí.' },
{ icon: Gauge, title: 'Nízkotlaký provoz 2–7 BAR', desc: 'Napojení na běžný vodovodní řad bez nutnosti čerpadel.' },
{ icon: Leaf, title: 'Pohlcuje prach a pyly', desc: 'Jemná mlha zachytává částice a osvěžuje ovzduší.' }];


export default function DetailTab({ product }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
            {product.image_url &&
            <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/078e25764_3a4d19965_Food_Brand_System_Style_Guide_In_a_photographic_style_a_circular_mister_sprays_QKFDjh9F1.jpg" alt={product.name} className="w-full h-full object-cover" />
            }
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Detail produktu</p>
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
              {product.name}
            </h2>
            <p className="text-slate-500 text-base font-light leading-relaxed">
              {product.description || product.short_description || 'Nerezová konstrukce AISI 316L navržená pro celoroční venkovní provoz s důrazem na minimalistický design a spolehlivost.'}
            </p>
          </motion.div>
        </div>

        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Výhody a přínosy</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b, i) =>
          <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
          className="p-6 rounded-2xl border border-slate-200 bg-white">
              <b.icon size={22} className="text-slate-500 mb-4" />
              <h3 className="text-slate-900 text-sm font-medium mb-1.5">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">{b.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}