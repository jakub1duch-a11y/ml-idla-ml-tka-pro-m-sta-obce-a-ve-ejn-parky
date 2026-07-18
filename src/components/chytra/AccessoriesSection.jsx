import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Radio, Thermometer, Droplets, Smartphone, CloudSun, Move } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';
import { base44 } from '@/api/base44Client';

const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';

const ACCESSORIES = [
{ icon: Radio, label: 'Spouštěcí senzory', desc: 'Automaticky zapnou mlžení, jakmile je v okolí zaznamenán pohyb nebo přítomnost osob.' },
{ icon: Thermometer, label: 'Snímače teploty', desc: 'Hlídají okolní teplotu a spouští mlžení po překročení nastaveného limitu.' },
{ icon: Droplets, label: 'Snímače vlhkosti', desc: 'Regulují intenzitu mlžení podle aktuální vlhkosti vzduchu — žádné zbytečné mokro.' },
{ icon: Smartphone, label: 'Programovatelná aplikace', desc: 'Nastavte si vlastní scénáře, časy a limity přímo z mobilu.' },
{ icon: CloudSun, label: 'Integrace dle počasí a času', desc: 'Propojení s předpovědí počasí a denní dobou pro plně automatický provoz.' },
{ icon: Move, label: 'Pohybové senzory', desc: 'Reagují na pohyb v prostoru — ideální pro vstupy, terasy a hřiště.' }];


export default function AccessoriesSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    base44.entities.Product.filter({ category_id: ACCESSORY_CATEGORY_ID })
      .then((prods) => setProducts((prods || []).sort((a, b) => (a.name || '').localeCompare(b.name || '', 'cs'))))
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="bg-slate-50 border-t border-slate-200 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="content-eyebrow mb-3">Moduly a příslušenství</p>
          <h2 className="content-title text-3xl mb-4">Senzory a chytré doplňky ke každému mlžítku.</h2>
          <p className="content-lead">Rychlé nastavení, mobilní aplikace a plně programovatelné scénáře — přizpůsobte mlžení počasí, vlhkosti, času i pohybu.</p>
        </div>

        {products.length > 0 &&
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {products.map((p, i) =>
          <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={`/produkt/${p.slug}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                {p.image_url &&
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                }
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-900 font-medium mb-1">{p.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{p.short_description}</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </Link>
            </motion.div>
          )}
        </div>
        }

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {ACCESSORIES.map((a, i) =>
          <motion.div key={a.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden">
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <a.icon size={18} className="text-slate-900" />
              </div>
              <h3 className="text-slate-900 font-medium mb-1.5">{a.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{a.desc}</p>

              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link to={`/kontakt?produkt=${encodeURIComponent(a.label)}`}
                  onClick={() => trackQuickInquiryClick(a.label, 'accessories_hover')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-slate-100 transition-colors">
                  Poptat {a.label.toLowerCase()} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        <Link to="/kontakt?produkt=Příslušenství%20a%20senzory"
          onClick={() => trackQuickInquiryClick('Příslušenství a senzory', 'accessories_section')}
          className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
          Poptat příslušenství <ArrowRight size={16} />
        </Link>
      </div>
    </section>);

}