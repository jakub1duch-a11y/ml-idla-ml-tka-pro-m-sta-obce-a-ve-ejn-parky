import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Loader, Radio, Thermometer, Droplets, Wifi, CloudSun, Move } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';
import { trackQuickInquiryClick } from '@/lib/ga4';

const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';

const SMART_MODULES = [
  { icon: Radio, label: 'Spouštěcí senzory', desc: 'Automaticky zapnou mlžení při zaznamenání pohybu nebo přítomnosti osob.' },
  { icon: Thermometer, label: 'Snímače teploty', desc: 'Hlídají okolní teplotu a spouští mlžení po překročení nastaveného limitu.' },
  { icon: Droplets, label: 'Snímače vlhkosti', desc: 'Regulují intenzitu mlžení podle aktuální vlhkosti vzduchu.' },
  { icon: Wifi, label: 'Řídicí ventily', desc: 'Programovatelné ventily pro dálkové a automatické ovládání průtoku vody.' },
  { icon: CloudSun, label: 'Integrace dle počasí', desc: 'Propojení s předpovědí počasí a denní dobou pro plně automatický provoz.' },
  { icon: Move, label: 'Pohybové čidla', desc: 'Reagují na pohyb v prostoru — ideální pro vstupy, terasy a hřiště.' },
];

export default function PrislusenstviSmartModuly() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO({
      title: 'Příslušenství a smart moduly',
      description: 'Trysky, kotvení a chytré moduly pro mlžné systémy — senzory, čidla, snímače a ventily na míru.',
      keywords: 'příslušenství mlžítek, smart moduly, mlžící tryska, zemní vrut, senzory mlžení',
      canonicalPath: '/prislusenstvi',
    });
    base44.entities.Product.filter({ category_id: ACCESSORY_CATEGORY_ID })
      .then((prods) => setProducts((prods || []).sort((a, b) => (a.name || '').localeCompare(b.name || '', 'cs'))))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════ HERO ═══════ */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-slate-700 transition-colors">Domů</Link>
            <ChevronRight size={12} />
            <Link to="/mlzidla-mlzitka" className="hover:text-slate-700 transition-colors">Produkty</Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium">Příslušenství a smart moduly</span>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Doplňky a chytré řízení</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-5 max-w-3xl">
            Příslušenství a smart moduly
          </h1>
          <p className="text-slate-500 text-lg font-light max-w-2xl leading-relaxed">
            Náhradní trysky, kotvení pro mobilní instalaci i chytré senzory a ventily pro plně automatický provoz —
            vše, co potřebujete k rozšíření nebo údržbě vašeho mlžného systému.
          </p>
        </div>
      </section>

      {/* ═══════ PRODUKTY (grid) ═══════ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Skladem</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-10">Trysky a kotvení</h2>

          {loading ? (
            <div className="flex justify-center py-16"><Loader size={24} className="animate-spin text-slate-300" /></div>
          ) : products.length === 0 ? (
            <p className="text-slate-400 font-light">Zatím žádné produkty k zobrazení.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <Link to={`/produkt/${p.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all bg-white h-full">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-slate-900 font-medium mb-1.5">{p.name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">{p.short_description}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:gap-2.5 transition-all">
                        Detail produktu <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ SMART MODULY — obecná poptávka ═══════ */}
      <section className="py-16 lg:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Na míru</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">Smart moduly — senzory, čidla a ventily.</h2>
            <p className="text-slate-500 text-base font-light leading-relaxed">
              Chytré řízení mlžení dle počasí, vlhkosti nebo pohybu osob. Moduly navrhujeme na míru konkrétní instalaci — vyžádejte si nezávaznou konzultaci.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {SMART_MODULES.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <m.icon size={18} className="text-slate-900" />
                </div>
                <h3 className="text-slate-900 font-medium mb-1.5">{m.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>

          <Link to="/kontakt?produkt=Smart%20moduly%20(senzory%2C%20čidla%2C%20snímače%2C%20ventily)"
            onClick={() => trackQuickInquiryClick('Smart moduly', 'prislusenstvi_page')}
            className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
            Poptat smart moduly <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 mb-3">Nevíte, co přesně potřebujete?</h2>
          <p className="text-slate-500 mb-6 font-light">Poradíme s výběrem trysek, kotvení i chytrého řízení pro váš mlžný systém.</p>
          <Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}