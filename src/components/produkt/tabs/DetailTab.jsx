import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, ShieldCheck, Gauge, Leaf, Maximize2, ImageOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BENEFITS = [
{ icon: Thermometer, title: 'Ochlazení až o 10 °C', desc: 'Evaporativní mikroklima okamžitě snižuje teplotu okolí.' },
{ icon: ShieldCheck, title: 'Certifikovaná bezpečnost', desc: 'Splňuje ČSN EN 1176 pro veřejná dětská hřiště a náměstí.' },
{ icon: Gauge, title: 'Nízkotlaký provoz 2–7 BAR', desc: 'Napojení na běžný vodovodní řad bez nutnosti čerpadel.' },
{ icon: Leaf, title: 'Pohlcuje prach a pyly', desc: 'Jemná mlha zachytává částice a osvěžuje ovzduší.' }];


export default function DetailTab({ product, onOpenLightbox }) {
  const [realizace, setRealizace] = useState([]);

  useEffect(() => {
    if (!product?.name) return;
    base44.entities.Realizace.filter({ product_used: product.name }).
    then((res) => setRealizace((res || []).filter((r) => r.published !== false && r.image_url).slice(0, 6))).
    catch(() => setRealizace([]));
  }, [product?.name]);

  const realizaceImages = realizace.map((r) => r.image_url);

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] group">
            {product.image_url ?
            <button type="button" onClick={() => onOpenLightbox?.(0)} className="w-full h-full block">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={15} />
                </span>
              </button> :

            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <ImageOff size={28} />
                <span className="text-xs font-mono uppercase tracking-widest">Fotografie doplní se</span>
              </div>
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

        {/* Malá galerie realizovaných instalací a výroby daného modelu */}
        {realizaceImages.length > 0 &&
        <div className="mb-20">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Realizace a výroba — {product.name}</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {realizaceImages.map((url, i) =>
            <motion.button key={url + i} type="button" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
            onClick={() => onOpenLightbox?.(0, realizaceImages)}
            className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                  <img src={url} alt={`${product.name} realizace ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </motion.button>
            )}
            </div>
          </div>
        }

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