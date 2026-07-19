import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Radio, Settings2, Smartphone } from 'lucide-react';
import { trackQuickInquiryClick } from '@/lib/ga4';
import { base44 } from '@/api/base44Client';
import SystemComponentCard from '@/components/katalog/SystemComponentCard';

const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';

const ACCESSORIES = [
  { icon: Droplets, kicker: 'Rozptyl vody', title: 'Nerezová tryska', desc: 'Vytváří jemný mlžný kužel bez zbytečného smáčení okolí.', metrics: [['Materiál', 'AISI 316L'], ['Úhel', '70°']], to: '/produkt/mlzici-tryska' },
  { icon: Settings2, kicker: 'Řízení průtoku', title: 'Smart a ruční ventily', desc: 'Samostatné ovládání zóny, bezpečné uzavření a možnost časového plánu.', metrics: [['Ovládání', 'App / ruční'], ['Připojení', 'Wi‑Fi 2,4 GHz']], to: '/chytre-ventily-mlzitka' },
  { icon: Radio, kicker: 'Automatizace', title: 'Teplotní a pohybové senzory', desc: 'Spouštějí mlžení podle teploty, přítomnosti osob nebo provozního scénáře.', metrics: [['Vstup', 'teplota / pohyb'], ['Režim', 'automatický']], to: '/chytra-mlzidla' },
  { icon: Smartphone, kicker: 'Mobilní kontrola', title: 'Tuya Smart a Smart Life', desc: 'Spuštění mlžítka, denní interval od–do a přehled aktivních zón.', metrics: [['Platforma', 'iOS / Android'], ['Plán', 'denní cykly']], to: '/aplikace-ovladani-mlzitek' },
];


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

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACCESSORIES.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}><SystemComponentCard item={item} /></motion.div>)}
        </div>

        <Link to="/kontakt?produkt=Příslušenství%20a%20senzory"
          onClick={() => trackQuickInquiryClick('Příslušenství a senzory', 'accessories_section')}
          className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
          Poptat příslušenství <ArrowRight size={16} />
        </Link>
      </div>
    </section>);

}